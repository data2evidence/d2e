ALTER TABLE d4l_dd_with_decryption
ADD COLUMN processed Boolean NOT NULL DEFAULT FALSE;

ALTER TABLE d4l_dd_s4h
ADD COLUMN processed Boolean NOT NULL DEFAULT FALSE;