# direct-delivery-dashboard

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Code Climate][code-climate-image]][code-climate-url]

[travis-url]: https://travis-ci.org/eHealthAfrica/direct-delivery-dashboard
[travis-image]: https://img.shields.io/travis/eHealthAfrica/direct-delivery-dashboard/develop.svg
[coveralls-url]: https://coveralls.io/r/eHealthAfrica/direct-delivery-dashboard
[coveralls-image]: https://img.shields.io/coveralls/eHealthAfrica/direct-delivery-dashboard/develop.svg
[code-climate-image]: https://codeclimate.com/github/eHealthAfrica/direct-delivery-dashboard/badges/gpa.svg
[code-climate-url]: https://codeclimate.com/github/eHealthAfrica/direct-delivery-dashboard

> User-centred direct delivery management system

## Usage

0. Install [Node.js][] (>=0.12 <4, npm >=2 <3), [Git][] and [CouchDB][]
1. `npm install -g gulp`
2. `git clone https://github.com/eHealthAfrica/direct-delivery-dashboard.git`
3. `cd direct-delivery-dashboard && npm install`
4. `gulp [-u <user> -p <pass>] couchdb-bootstrap couchdb-fixtures`
5. `gulp serve`

[Node.js]: http://nodejs.org
[Git]: http://git-scm.com
[CouchDB]: https://couchdb.apache.org

## Authors

* © 2015 Haykel Ben Jemia <hbj@allmas.tn>
* © 2015 Jideobi Ofomah <jideobi.ofomah@ehealthnigeria.org>
* © 2015 Tom Vincent <tom.vincent@ehealthnigeria.org> (https://tlvince.com)
* © 2015 Femi Oni <oluwafemi.oni@ehealthnigeria.org>
* © 2015 Musa Musa <musa.musa@ehealthnigeria.org>

… and [contributors][].

[contributors]: https://github.com/eHealthAfrica/direct-delivery-dashboard/graphs/contributors

## License

Released under the [Apache 2.0 License][license].

[license]: http://www.apache.org/licenses/LICENSE-2.0.html
