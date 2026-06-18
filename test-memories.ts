const BASE_URL = process.env.REVIVE_BASE_URL ?? "http://localhost:3000";
const RUN_ID = `memory-test-${Date.now()}`;

type ApiResult<T = unknown> = {
  ok: boolean;
  status: number;
  data: T;
};

type MemoryRecord = {
  id: string;
  scope: "global" | "task_type";
  taskType: "plan" | "review" | "report" | null;
  dimension: "output_structure" | "citation_style" | "expression_style" | "task_structure";
  value: string;
  polarity: "positive" | "negative";
  source: "explicit_setting" | "user_feedback" | "behavior_inferred";
  sourceDetail: string | null;
  enabled: boolean;
};

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (error) {
    throw new Error(`无法连接到 ${BASE_URL}，请先启动 Revive：npm run dev`, {
      cause: error,
    });
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T) : (null as T);

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

function logStep(title: string, result: unknown) {
  console.log(`\n=== ${title} ===`);
  console.log(JSON.stringify(result, null, 2));
}

function assertLog(label: string, passed: boolean) {
  console.log(`${passed ? "PASS" : "FAIL"} ${label}`);
}

async function main() {
  console.log(`Testing Revive memories API at ${BASE_URL}`);
  console.log(`Run ID: ${RUN_ID}`);

  const globalCreate = await request<{ memory: MemoryRecord }>("/api/memories", {
    method: "POST",
    body: JSON.stringify({
      scope: "global",
      dimension: "expression_style",
      value: `测试全局偏好：输出更简洁 ${RUN_ID}`,
      polarity: "positive",
      source: "explicit_setting",
      sourceDetail: RUN_ID,
    }),
  });
  logStep("1. 新建一条全局偏好", globalCreate);
  assertLog("global memory created", globalCreate.ok && Boolean(globalCreate.data?.memory?.id));

  const taskTypeCreate = await request<{ memory: MemoryRecord }>("/api/memories", {
    method: "POST",
    body: JSON.stringify({
      scope: "task_type",
      taskType: "plan",
      dimension: "task_structure",
      value: `测试任务类型级偏好：方案按目标-策略-步骤组织 ${RUN_ID}`,
      polarity: "positive",
      source: "explicit_setting",
      sourceDetail: RUN_ID,
    }),
  });
  logStep("2. 新建一条任务类型级偏好", taskTypeCreate);
  assertLog("task type memory created", taskTypeCreate.ok && Boolean(taskTypeCreate.data?.memory?.id));

  const invalidCreate = await request("/api/memories", {
    method: "POST",
    body: JSON.stringify({
      scope: "global",
      taskType: "plan",
      task_type: "plan",
      dimension: "output_structure",
      value: `这条应该失败 ${RUN_ID}`,
      polarity: "positive",
      source: "explicit_setting",
      sourceDetail: RUN_ID,
    }),
  });
  logStep("3. 故意传 scope=global + task_type=plan，预期应该报错", invalidCreate);
  assertLog("invalid scope/task_type rejected", !invalidCreate.ok);

  const listAfterCreate = await request<{ memories: MemoryRecord[] }>("/api/memories");
  const createdMemories = (listAfterCreate.data?.memories ?? []).filter((memory) => memory.sourceDetail === RUN_ID);
  logStep("4. 获取全部记忆，确认前两条存在", {
    status: listAfterCreate.status,
    testCreatedCount: createdMemories.length,
    testCreated: createdMemories,
  });
  assertLog(
    "first two test memories exist",
    listAfterCreate.ok &&
      createdMemories.some((memory) => memory.id === globalCreate.data?.memory?.id) &&
      createdMemories.some((memory) => memory.id === taskTypeCreate.data?.memory?.id),
  );

  const firstId = globalCreate.data?.memory?.id;
  const secondId = taskTypeCreate.data?.memory?.id;

  if (!firstId || !secondId) {
    throw new Error("Missing created memory IDs; stop before mutating further.");
  }

  const toggleFirst = await request<{ memory: MemoryRecord }>(`/api/memories/${firstId}`, {
    method: "PATCH",
    body: JSON.stringify({ enabled: false }),
  });
  logStep("5. 停用第一条", toggleFirst);
  assertLog("first memory disabled", toggleFirst.ok && toggleFirst.data?.memory?.enabled === false);

  const deleteSecond = await request(`/api/memories/${secondId}`, {
    method: "DELETE",
  });
  logStep("6. 删除第二条", deleteSecond);
  assertLog("second memory deleted", deleteSecond.ok);

  const listAfterDelete = await request<{ memories: MemoryRecord[] }>("/api/memories");
  const remainingTestMemories = (listAfterDelete.data?.memories ?? []).filter((memory) => memory.sourceDetail === RUN_ID);
  logStep("6. 确认删除后本次测试数据只剩一条", {
    status: listAfterDelete.status,
    remainingTestCount: remainingTestMemories.length,
    remainingTestMemories,
  });
  assertLog(
    "only first test memory remains and is disabled",
    listAfterDelete.ok &&
      remainingTestMemories.length === 1 &&
      remainingTestMemories[0]?.id === firstId &&
      remainingTestMemories[0]?.enabled === false,
  );
}

main().catch((error) => {
  console.error("\nTest failed with unexpected error:");
  console.error(error);
  process.exit(1);
});
