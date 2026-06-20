UPDATE lessons
SET content = regexp_replace(
        content,
        '^[[:space:]]*#',
        '#'
              )
WHERE content ~ '^[[:space:]]*#';