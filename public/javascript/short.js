$('.btn-short').on('click', function(){
  //AJAX call to /api/short
  $.ajax({
    url: '/api/baby',
    type: 'POST',
    dataType: 'JSON',
    data: {url: $('#url-input').val()},
    success: function(data){
      var output = '<a class="result" href="' + data.shortURL + '">' 
          + data.shortURL + '</a>';
      $('#rtn-link').html(output);
      $('#rtn-link').hide().fadeIn('slow');
    }
  });

});