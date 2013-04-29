var Book = Backbone.Model.extend({
	defaults : function(){
		return {
            status : 'NOT_YET_READ'
        };
	},

	initialize : function(){
		this.bind('error', this.error, this);
		this.bind('sync', this.synced, this);
	},

	error : function(model, error){
	    console.log(error.statusText);
	},

	synced : function(model, error){
        $('#form-modal').modal('hide')
	}
});

var BookList = Backbone.Collection.extend({
	model : Book,
	url : '/books',

    search : function(q){
        books.fetch({
            data : {
                q : q
            }
        });
    }
});

var books = new BookList();

var BookFormView = Backbone.View.extend({
	el : $("#form-container"),
    template: _.template($('#book-form-template').html()),

	events : {
        "click a#save" : "persist"
    },

    render : function(params){
        params = params || {}
		this.$el.html(this.template(params));

        this.id = params['id'];
        this.save = this.$("#save");
        this.name = this.$("#name");
        this.author = this.$("#author");
        this.status = this.$("#status");

		return this;
	},

    initialize: function() {
        this.render();
    },

    persist : function(){
        var params = {
            name : this.name.val(),
            author : this.author.val(),
            status : this.status.val()
        }
        if(this.id){
            var book = books.get(this.id);
            book.set(params);
            book.save();
        }else
            books.create(params);
    }
});

var form = new BookFormView();

var BookView = Backbone.View.extend({
	tagName : "tr",
    template: _.template($('#book-template').html()),

	events : {
        "click a#delete" : "clear",
        "click a#edit" : "edit"
    },

    initialize: function() {

    },

    render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

    clear : function(){
        this.model.destroy();
    },

    edit : function(){
        form.render(this.model.toJSON());
        $('#form-modal').modal();
    }
});

var BookListView = Backbone.View.extend({
	el : $("#list-container"),
    template: _.template($('#book-list-template').html()),

	events : {},

    render : function(){
		this.$el.html(this.template());
        this.tbody = this.$('#table-body');

        this.addAll();

		return this;
	},

    initialize: function() {
        books.bind('add', this.addOne, this);
        books.bind('reset', this.addAll, this);
        books.bind('all', this.render, this);

        books.fetch();

        this.render();
    },

    addOne : function(book){
        var view = new BookView({model : book});
        this.tbody.append(view.render().el);
    },

    addAll : function(){
        books.each(this.addOne, this);
    }
});

var list = new BookListView();

$("#add-book").on('click', function(){
    form.render();
    $('#form-modal').modal();
});

$("#search-books").on('click', function(){
    var q = $("#search-text").val();
    books.search(q);
})