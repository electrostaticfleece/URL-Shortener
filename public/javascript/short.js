$('.btn-short').on('click', function(){
  //AJAX call to /api/short
  $.ajax({
    url: '/api/baby',
    type: 'POST',
    dataType: 'JSON',
    data: {url: $('#url-input').val()},
    success: function(data){
      var text = 'Congratulations! It\'s a boy: ',
          color = '#22A7F0',
          store = '#FD4569',
          output;

      if(Math.round(Math.random())){
        text = 'Congratulations! It\'s a girl: ';
        color = '#FD4569',
        store = '#22A7F0';
      }

      output = '<span>' + text + '<a class="result" target="_blank" href=http://"' + data.shortURL + '">' 
          + data.shortURL + '</a></span>';

      $('#rtn-link').html(output);
      $('#rtn-link').hide().css({"color": "#ecf0f1", "padding": "15px 5px" }).fadeIn('slow');
      $('body').css({"background-color": color}).fadeIn('slow');
      $('.btn-short').css({"background-color": store});
    }
  });

});