// Read a page's GET URL variables and return them as an associative array.
// Source: http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html

/********************
https://mathiasbynens.be/notes/xhr-responsetype-json
********************/
//var devpostUserAPI = 'https://iii3mdppm7.execute-api.us-east-1.amazonaws.com/prod/UserPortfolioEndpoint/';
//var devpostProjectAPI = 'https://iii3mdppm7.execute-api.us-east-1.amazonaws.com/prod/ProjectEndpoint/';
var refString="?ref_content=follow_widget&utm_source=follow_widget"

var getJSON = function(type, successHandler, errorHandler) {

  switch (type){
    case 'follow':
      url = 'https://iii3mdppm7.execute-api.us-east-1.amazonaws.com/prod/UserPortfolioEndpoint/' + user;
      break;

    case 'like':
      url = 'https://iii3mdppm7.execute-api.us-east-1.amazonaws.com/prod/ProjectEndpoint/' + project;
      break;
  }

var xhr = typeof XMLHttpRequest != 'undefined'
  ? new XMLHttpRequest()
  : new ActiveXObject('Microsoft.XMLHTTP');
xhr.open('get', url, true);
xhr.responseType = 'json';
xhr.onreadystatechange = function() {
  var status;
  var data;
  // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
  if (xhr.readyState == 4) { // `DONE`
    status = xhr.status;
    if (status == 200) {
      successHandler && successHandler(xhr.response);
    } else {
      errorHandler && errorHandler(status);
    }
  }
};
xhr.send();
};
/********************
END XHR STUFF
********************/

var params = (function () {
  var vars = [],
      hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}());

// Add commas to numbers
function addCommas(n) {
  return String(n).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

var user = params.user,
    type = params.type,
    count = params.count,
    project = params.project,
    size = params.size,
    v = params.v,
    head = document.getElementsByTagName('head')[0],
    button = document.getElementById('gh-btn'),
    mainButton = document.getElementById('github-btn'),
    text = document.getElementById('gh-text'),
    counter = document.getElementById('gh-count'),
    labelSuffix = ' on Devpost';
    var followers = '';
    var likes = '';
    var projectName = '';

    /********************
    OK, a little more XHR stuff
    ********************/
    getJSON(type, function(data) {

      switch (type){
        case 'follow':
          followers = data.followers_count;
          counter.innerHTML = addCommas(followers);
          console.log('Followers: ' + followers);
          break;

        case 'like':
          likes = data.likes_count;
          //projectName = data.title;
          counter.innerHTML = addCommas(likes);
          console.log('Likes: ' + likes);
          break;
      }
    }, function(status) {
        console.log('something went wrong');
        return null;
      });



// Show the count if asked
if (count === 'true' && counter.innerHTML !== null) {
  switch (type){
    case 'follow':
      counter.setAttribute('aria-label', counter.innerHTML + ' followers' + labelSuffix);
      break;

    case 'like':
      counter.setAttribute('aria-label', counter.innerHTML + ' likes' + labelSuffix);
      break;
  }


    counter.style.display = 'block';
}

// Set href to be URL for user
//button.href = 'https://devpost.com/' + user + '/';

// Add the class, change the text label, set count link href
switch (type) {
  case 'like':
    mainButton.className += ' github-stargazers';
    text.innerHTML = 'Like';
    button.href = 'http://devpost.com/software/' + project + refString;
    counter.href = 'http://devpost.com/software/' + project + refString + '/#share-and-like';
    break;

  case 'follow':
    mainButton.className += ' github-me';
    text.innerHTML = 'Follow @' + user;
    button.href = 'https://github.com/' + user + refString;
    counter.href = 'https://github.com/' + user + '/followers' + refString;
    break;
}

button.setAttribute('aria-label', text.innerHTML + labelSuffix);

// Change the size
if (size === 'large') {
  mainButton.className += ' github-btn-large';
}
