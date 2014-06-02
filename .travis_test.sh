# 
# Test OpenERP web module with Travis and Github
# 
 
# Parameters for web module tests


REPO_NAME="openerp-web-unleashed"
MODULE_NAME="web_unleashed"

# Script...

cd ..


DIR=$( cd "$( dirname "$0" )" && pwd )

COMMAND_REPO="$DIR/cmd"
SERVER_REPO="$DIR/openerp"
export PYTHONPATH=$SERVER_REPO:$COMMAND_REPO
export PATH=$SERVER_REPO:$COMMAND_REPO:$PATH

ADDONS="$DIR/openerp/openerp/addons,$DIR/$REPO_NAME"

echo "location: $DIR"
echo "PYTHONPATH: $PYTHONPATH"

echo "start openerp"

# launch openerp server
./openerp/openerp-server -d web_unleashed_test -r openerp --addons $ADDONS > /dev/null &
server_pid=$!

echo "openerp server started"

# wait for server init
echo "sleep 5s"
sleep 5

echo "run web tests"
./cmd/oe run-tests -d ignored --addons $ADDONS -m $MODULE_NAME
exit_code=$?

echo "kill openerp server with pid ${server_pid}"
sudo kill -9 $server_pid

exit $exit_code
