#!/bin/bash

set -euo pipefail
rsync -av --delete ./ --exclude=.git visarend.solasistim.net:/srv/http/solasistim/shl/trials-dendro/
