class JobsController < ApplicationController
  before_filter :check_session
  before_filter :get_coutry_wise_items
  
  def pending
    @pending_jobs = Delayed::Job.paginate(:page => params[:page]).order("created_at desc")
    #raise @pending_jobs.first.inspect
   
    #raise @pending_jobs.first.payload_object.args.  inspect
  end
  
  def completed
    @completed_jobs = CompletedJob.where("created_at >= ?", Date.today-1.days).paginate(:page => params[:page]).order("created_at desc")
  end  
end
