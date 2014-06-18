#!/bin/bash
# Install the nightly version of OpenERP

cd ..
rm openerp src cmd -rf

# install dependencies
sudo apt-get -ym install python-dateutil python-docutils python-feedparser python-gdata python-jinja2 python-ldap python-lxml python-mako python-mock python-openid python-psycopg2 python-psutil python-pybabel python-pychart python-pydot python-pyparsing python-reportlab python-simplejson python-tz python-unittest2 python-vatnumber python-vobject python-webdav python-werkzeug python-xlwt python-yaml python-zsi python-imaging bzr python-pip
sudo apt-get -ym install phantomjs
sudo pip install unittest2 QUnitSuite


# get openerp nightly build
wget http://nightly.openerp.com/7.0/nightly/src/openerp-7.0-latest.tar.gz

# extract and setup openerp
mkdir -p src
tar -xf openerp-7.0-latest.tar.gz -C src

for f in ./src/*
do
    echo "$f" | grep -Eq '^\./abc.[0-9]+$' && continue
    echo "Something with $f here"
done

mv $f openerp
rm -rf ./src

# install oe command from openobject-server trunk repo
mkdir cmd -p
cd cmd
bzr export openerpcommand lp:openobject-server/openerpcommand/
wget http://bazaar.launchpad.net/~openerp/openobject-server/trunk/download/head:/oe-20130111134433-deitrzi0ymox3e5l-1/oe
sudo chmod a+x oe
cd ..



#sudo python setup.py --quiet install
