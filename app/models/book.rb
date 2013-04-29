class Book < ActiveRecord::Base
  attr_accessible :author, :name, :status

  validates :name,  :presence => true
  validates :author,  :presence => true
  validates :status,  :presence => true
end
