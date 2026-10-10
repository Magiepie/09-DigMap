# Readable player JSON uploads

Use Submit digs on the published website to open the GitHub Issue form, then paste:

```json
{
  "username": "Example Player",
  "tiles": [
    [3222, 3218, 0],
    [3223, 3218, 0]
  ]
}
```

Each tile is [x, y, plane]; plane defaults to zero if omitted. X/Y: integers 0–65535; plane: 0–3. Usernames contain 1–32 ASCII letters, numbers, spaces, underscores or hyphens. Up to 1,000,000 entries are accepted by the validator, although GitHub Issue text limits may require smaller batches. Submit additional Issues for batches; uploads merge without duplicate tiles.

The Action stores readable files in players/, rebuilds index.json, community.json and atlas.json, and deploys GitHub Pages. All submissions are public. Export buttons download readable JSON for reference. There is no browser import or attachment download step; paste JSON into the Issue form.
