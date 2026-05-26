create unique index if not exists idx_items_unique_url_import
on items (collection_id, source_type, source_url)
where source_url is not null and source_type = 'url';

create unique index if not exists idx_items_unique_manual_import
on items (collection_id, source_type, title, md5(content_text))
where source_type = 'manual_text';
