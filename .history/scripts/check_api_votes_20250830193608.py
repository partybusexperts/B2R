import sys
import json
import requests

paths = ["http://127.0.0.1:3000/api/poll/all","http://127.0.0.1:3000/api/poll/raw"]
for path in paths:
    try:
        r = requests.get(path, timeout=5)
        print(path, r.status_code, 'bytes=', len(r.content))
        try:
            j = r.json()
        except Exception as e:
            print('  json parse error:', e)
            continue
        # try common shapes
        votes = None
        if isinstance(j, dict) and 'votes' in j:
            votes = j['votes']
        elif isinstance(j, dict) and 'data' in j and isinstance(j['data'], dict) and 'votes' in j['data']:
            votes = j['data']['votes']
        else:
            votes = j if isinstance(j, dict) else {}
        print('  top_keys:', list(votes.keys())[:5], 'total:', len(votes))
    except Exception as e:
        print('ERR', path, e)
        sys.exit(2)
print('done')
