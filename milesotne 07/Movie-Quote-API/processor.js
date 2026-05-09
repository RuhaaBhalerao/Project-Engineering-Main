// Artillery processor for custom hooks
module.exports = {
  setup: function(context, ee, next) {
    console.log('Load test started');
    return next();
  },
  cleanup: function(context, ee, next) {
    console.log('Load test completed');
    return next();
  }
};
