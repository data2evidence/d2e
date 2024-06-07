ALTER TABLE d4l_dd_with_error
ADD COLUMN http_context_identifier varchar(50) NULL,
ADD COLUMN http_multipart_fragments_sequence_number integer NULL,
ADD COLUMN http_multipart_fragments_total_number integer NULL;
