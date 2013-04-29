class BooksController < ApplicationController

  def parse_body request
    request.body.rewind
    data = request.body.read
    JSON.parse(data, {:symbolize_names => true})
  end

  # GET /books
  def index
    q = params[:q]

    if q.nil? or q == ''
      @books = Book.all
    else
      @books = Book.where("name like ?", "%#{q}%").all
    end

    respond_to do |format|
      format.html { render json: @books }
    end
  end

  # GET /books/1
  def show
    @book = Book.find(params[:id])

    respond_to do |format|
      format.html { render json: @book }
    end
  end

  # POST /books
  def create
    data = parse_body request
    @book = Book.new(data)

    respond_to do |format|
      if @book.save
        format.html { render json: @book, status: :created, location: @book }
      else
        format.html { render json: @book.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /books/1
  def update
    @book = Book.find(params[:id])
    data = parse_body request

    respond_to do |format|
      if @book.update_attributes(data.reject {|key,_| key == :id or key == :updated_at or key == :created_at})
        format.html { head :no_content }
      else
        format.html { render json: @book.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /books/1
  def destroy
    @book = Book.find(params[:id])
    @book.destroy

    respond_to do |format|
      format.html { head :no_content }
    end
  end
end
