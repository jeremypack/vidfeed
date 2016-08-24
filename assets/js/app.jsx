var React = require('react');
var LoginForm = require('./login');
var CommentContainer = require('./comments/commentContainer');


module.exports = React.createClass({
   render: function(){
       return (
         <div>
           <LoginForm />
           <CommentContainer />
         </div>);
   }
});