// index

Router.route('/', function () {
  this.render('index');
});


Router.route('/manage', function () {
  this.render('manage');
});

Router.route('/matchmaking', function () {
    this.render('matchmaking');
});