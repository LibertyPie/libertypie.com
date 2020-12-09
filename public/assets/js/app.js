// @koala-prepend "jquery-3.5.1.min.js"
// @koala-prepend "bootstrap.min.js"
// @koala-prepend "simpleParallax.min.js"
// @koala-prepend "parallaxie.js"
// @koala-prepend "theme-script.js"
// @koala-prepend "../libs/slick/slick.min.js"
// @koala-prepend "theme-script.js"
// @koala-prepend "jquery.countTo.js"
  

async function fetchLatestBlogFeed() {

    
   $("#blog_posts_sections").css("display","none");

    var RSS_URL = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@liberty-pie";

    $.get(RSS_URL, function(data){
        processMediumRssFeed(data)
    })
    .fail(function(){
        console.error("Fetch Medium Feed  Error: ",err) 
    })
}


async function processMediumRssFeed(data){
    
    var  status = data.status || "failed";
    var  itemsArray = data.items  || [];

    if(status != "ok" || (itemsArray.length || 0) == 0){ return false; }

    var newsSlider = $('#news_carousel .carousel_items');
    
    newsSlider.slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        autoplay: true,
        dots: false,
        prevArrow: $("#news_carousel .slick_prev"),
        nextArrow: $("#news_carousel .slick_next"),
        draggable: true,
        centerMode: false,

        responsive: [
            {
              breakpoint: 1000,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                centerMode: true
              }
            },
            {
              breakpoint: 800,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                centerMode: false
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true
              }
            }
        ]
    });

    for(var i in itemsArray){

       var itemObj = itemsArray[i];

        var  content  =  (itemObj.content || "").trim();
        var  pubDateStr  = (itemObj.pubDate || null);
        var  title    =  (itemObj.title || "").trim();
        var thumbnail =  (itemObj.thumbnail || "").trim();

        var  link = itemObj.link;

        var pubDateObj = new Date(Date.parse(pubDateStr));

        var formattedDate = pubDateObj.toLocaleDateString('en-GB', {
            day : 'numeric',
            month : 'short',
            year : 'numeric'
        }).split(' ');

        if((thumbnail.length || 0) == 0){
            thumbnail  = "/assets/img/img.svg";
        }

        if((content.length || 0) == 0) return false;

        var contentHTML = $(content).filter("p");

        //console.log(contentHTML)

        if((contentHTML.length || 0) == 0) return false;

        var firstParagraph = contentHTML.first().text();

        if(firstParagraph.length > 60){ firstParagraph = firstParagraph.substring(0,60) + ".."; }

        var postCard = $(
            '<div class="_news_card_item px-2" data-url="'+link+'">'+
                '<div class="item">'+
                    '<div class="card bg-light" style="height:465px;">'+
                        '<div class="position-absolute bg-white shadow-primary text-center p-2 rounded ml-3 mt-3">'+
                            formattedDate[0]+
                            '<br>'+
                            formattedDate[1]+
                            '<br>'+
                            formattedDate[2]+
                        '</div>'+
                         '<div class="fit-img">'+
                            '<img class="card-img-top shadow" src="'+thumbnail+'"  alt="">'+
                         '</div>'+
                        '<div class="card-body pt-2 bg-white">'+
                            '<a class="d-inline-block text-muted mb-2">&nbsp;</a>'+
                            '<h2 class="h5 font-weight-medium text-truncate">'+
                                '<a class="link-title" href="'+link+'" target="_blank">'+title+'</a>'+
                            '</h2>'+
                            '<p class="mb-0">'+firstParagraph+'</p>'+
                        '</div>'+
                        '<div class="card-footer bg-transparent border-0 text-center p-2 py-3 text-muted"><a class="link-title" href="'+link+'" target="_blank">Read More</a></div>'+
                        '<div></div>'+
                    '</div>'+
                '</div>'+
            '</div>'
        );

        newsSlider.slick('slickAdd',postCard);
    } //end loop

    $(document).on("click","._news_card_item",function(){
        var link = $(this).data("url") || null
        if(link  == null) return false;
        var win = window.open(link, '_blank');
        win.focus();
    });

   $("#blog_posts_sections").css("display","block");

} //end 
