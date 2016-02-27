// Sample IBM X-Force Exchange request:
// https://exchange.xforce.ibmcloud.com/url/facebook.com

// Alert levels:
// Red - #BD3D3D - Super malicious site
// Yellow - #E0C661 - Was reported as malicious
// Green - #38BD21 - Safe link, probably not even shown


// Retrieve an Anonymous Token (may be depracted soon, better solution on the way)
// GET https://api.xforce.ibmcloud.com/auth/anonymousToken
var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "https://api.xforce.ibmcloud.com/auth/anonymousToken", false ); // false for synchronous request
xmlHttp.send( null );
var token = JSON.parse(xmlHttp.responseText).token;

var links = document.links


function makeRequest (method, url)
{
  return new Promise(function (resolve, reject)
  {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Authorization", "Bearer "+ token);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300)
      {
        resolve(
          {
            response: xhr.response,
            url: url
          }
        );
      } else
      {
        reject(
          {
          status: this.status,
          statusText: xhr.statusText
          }
        );
      }
    };
    xhr.onerror = function ()
    {
      reject(
        {
        status: this.status,
        statusText: xhr.statusText
        }
      );
    };
    xhr.send();
  });
}



for (var i = 0; i < links.length; i++)
{
     //To change all link colors to white (for trolling etc..): links[i].setAttribute('style', 'color:#fff;')
     // The line above totally expresses how tired I am right now. Should be cleaned up tomorrow


       // Per sec sample malware-infecter website. DON'T OPEN THE SITE ITSELF!!
       makeRequest('GET', 'https://api.xforce.ibmcloud.com/url/hpareyouhereqq.com')
        .then(function (r)
        {
          console.log(r.url)
          console.log(r.response);
          links = document.getElementsByTagName("a");

          for(var i = 0; i < links.length; i++)
          {
            if( links[i].href === r.url )
            {
              console.log(links[i])
              return;
            }
          }
        }
        )
        .catch(function (err)
        {
          console.error('ERROR! ', err.statusText);
        });

      

}
