# Submit digs with a JSON attachment

Click Submit digs on the map to open https://github.com/Magiepie/09-DigMap/issues/new?template=dig-upload.yml. Drag your .json file into Player JSON attachment, or use its attachment button. Wait for upload completion, leave the generated link in the field, and submit the Issue.

The Action downloads the public GitHub attachment, validates the username and [x,y,plane] coordinates, merges player digs, rebuilds the community JSON, and deploys Pages. Maximum attachment size: 5 MB. Attach exactly one JSON file per Issue. First upload binds that username to the submitting GitHub account. Invalid submissions close with feedback; correct the file and reopen to retry.

Player files, searchable index, community union, and website atlas live in data/. Exports remain readable JSON. The repository must have Settings > Pages > Source set to GitHub Actions.

Run node test-dig-data.cjs, node test-outline.cjs, node test-issues.cjs and node test-attachments.cjs for local verification. The Issue parser retains compatibility with older pasted-JSON submissions.
