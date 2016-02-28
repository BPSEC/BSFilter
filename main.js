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

//TODO: Do link filtering like cut down those with # ending but same url
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



       makeRequest('GET', 'https://api.xforce.ibmcloud.com/url/' + links[i].href)
        .then(function (r)
        {
          // These for testing too:
          // console.log(r.url)
          // console.log(r.response)
          resp = JSON.parse(r.response)
          links = document.getElementsByTagName("a");
          //TODO: DO something with this mess!!
          for(var i = 0; i < links.length; i++)
          {
            // For testing: console.log(links[i].href + ' -- ' + 'https://api.xforce.ibmcloud.com/url/' + r.url)
            if( 'https://api.xforce.ibmcloud.com/url/' + links[i].href === r.url )
            {
              // TODO: Popup and an alert to confirm navigation if links are yellow or red
              if(resp.result.score > 3)
              {
                console.log(links[i])
                // set it yellow to indicate problems
                links[i].setAttribute('style', 'color:#E0C661;border: solid 1px #E0C661;padding: 4px;')
                return;
              }
              else if (resp.result.score >7) {
                console.log(links[i])
                // set it red to indicate DANGER!
                links[i].setAttribute('style', 'color:#BD3D3D;border: solid 1px #BD3D3D;padding: 4px;')
                return;
              }
            }
          }
        }
        )
        .catch(function (err)
        {
          console.error('ERROR! ', err.statusText);
        });



}
