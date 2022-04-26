
var animationSpeed = 750;
var library = [];

$(document).ready(function(){
    fillLibrary();
    attachAnimations();    
});

/* -----------------------------------------------------------------------------
    FILL PAGE HTML 
   ---------------------------------------------------------------------------*/
function fillLibrary() {
    assembleData();
    var classlist = ['left-side first','left-side','left-side','right-side','right-side','right-side last'];
        for (i=0; i < library.length; i++) {
            var book = library[i];
            // add html for current book
            var html = '<li class="book ' + classlist[0] + '">';
            html += '<div class="cover"><img src="' + book.cover + '" /></div>';
            html += '<div class="summary">';
            html += '<h1>' + book.title + '</h1>';
            html += '<h2>by ' + book.author + '</h2>';
            html += '<p>' + book.abstract + '</p>';
            html += '</div></li>';
            $('.library').append(html);
            // shift the classlist array for the next iteration
            var cn = classlist.shift();
            classlist.push(cn);
        }
   
}
/* -----------------------------------------------------------------------------
    ANIMATION 
   ---------------------------------------------------------------------------*/
function attachAnimations() {
    $('.book').click(function(){
        if (!$(this).hasClass('selected')) {
            selectAnimation($(this));
        }
    });
    $('.book .cover').click(function(){
        if ($(this).parent().hasClass('selected')) {
           deselectAnimation($(this).parent());
        }
    });
}

function selectAnimation(obj) {
    obj.addClass('selected');
    // elements animating
    var cover = obj.find('.cover');
    var image = obj.find('.cover img');
    var library = $('.library');
    var summaryBG = $('.overlay-summary');
    var summary = obj.find('.summary');
    // animate book cover
    cover.animate({
        width: '300px',
        height: '468px' 
    }, {
        duration: animationSpeed
    });
    image.animate({
        width: '280px',
        height: '448px',
        borderWidth: '10px'
    },{
        duration: animationSpeed
    });
    // add fix if the selected item is in the bottom row
    if (isBtmRow()){
      library.css('paddingBottom','234px');
    }
    // slide page so book always appears
    positionTop();
    // add background overlay
    $('.overlay-page').show();
    // locate summary overlay    
    var px = overlayVertPos();
    summaryBG.css('left',px);
    // animate summary elements
    var ht = $('.content').height();
    var pos = $('.book.selected').position();
    var start = pos.top + 30; // 10px padding-top on .book + 20px padding of .summary
    var speed = Math.round((animationSpeed/ht) * 450); // 450 is goal height
    summaryBG.show().animate({
        height: ht + 'px'
    },{
        duration: animationSpeed,
        easing: 'linear',
        step: function(now,fx){
            if (now > start && fx.prop === "height"){
                if(!summary.is(':animated') && summary.height() < 450){
                    summary.show().animate({
                        height: '450px'
                    },{
                        duration: speed,
                        easing: 'linear'
                    });
                }
                
            }
        } 
        
    });
}

function deselectAnimation(obj) {
    // elements animating
    var cover = obj.find('.cover');
    var image = obj.find('.cover img');
    var library = $('.library');
    var summaryBG = $('.overlay-summary');
    var summary = obj.find('.summary');
    // stop summary animation
    summary.stop();
    // animate book cover
    cover.stop().animate({
        width: '140px',
        height: '224px' 
    },{
        duration:animationSpeed
    });
    image.stop().animate({
        width: '140px',
        height: '224px',
        borderWidth: '0px'
    },{
        duration: animationSpeed,
        complete: function() {
            obj.removeClass('selected');
        }
    });
    // remove fix for bottom row, if present
    library.stop().animate({
        paddingBottom:'10px'
    },{ 
        duration: animationSpeed
    });
    // remove background overlay and summary
    var ht = summaryBG.height();
    var pos = $('.book.selected').position();
    var start = pos.top + 480; //10px of top padding + 470px for .summary height + padding
    var speed = Math.round((animationSpeed/ht) * summary.height());
    summaryBG.stop().animate({
        height: '0px'
    },{
        duration: animationSpeed,
        easing: 'linear',
        step: function(now,fx){
            if (now < start && fx.prop === "height"){
                if(!summary.is(':animated') && summary.height() > 0){
                    summary.animate({
                        height: '0px'
                    },{ 
                        duration: speed,
                        easing: 'linear',
                        complete: function(){
                            summary.hide(); 
                        }
                    });
                }
                
            }
        }, 
        complete: function(){
            $('.overlay-page').hide();
            summary.hide(); // catching this twice to insure for aborted animation
            summaryBG.hide();
        }
    });
}

function isBtmRow() {
    var pos = $('.book.selected').position();
    var libHgt = $('.content').height();
    if (libHgt-pos.top===254) { // this is current height of the book, plus 30 for padding on the book and library
        return true;
    } else {
        return false;
    }
}

function positionTop() { 
   var offset = $('.book.selected').offset();
   var bTop = offset.top;
   $('html, body').animate({ scrollTop: bTop }, animationSpeed);
}

function overlayVertPos() { // determines the vertical position for the summary overlay based on selection position
    var pos = $('.book.selected').position();
    switch(pos.left) {
        case 0:
            return '320px';
        case 160:
            return '320px';
        case 320:
            return '480px';
        case 480:
            return '0px';
        case 640:
            return '160px';
        case 800:
            return '160px';
        default:
            return false;
    }
}
/* -----------------------------------------------------------------------------
    BUILD LIBRARY ARRAY 
   ---------------------------------------------------------------------------*/
function Book(cover,title,author,abstract) {
    this.cover = cover;
    this.title = title;
    this.author = author;
    this.abstract = abstract;
    library.push(this);
}

function assembleData() {
    var book;
    book = new Book("https://i.ibb.co/SnTMnXt/31.jpg" ,'WWI','Clara Barton','"You glorify the women who made their way to the front to reach you in your misery, and nurse you back to life."');
    book = new Book("https://i.ibb.co/GW1y5VK/32.png" ,'WWI','Clara Barton','"Let his work be that of angels, still it will not satisfy all."');
    book = new Book("https://i.ibb.co/fpTvwQ0/33.png",'WWI','Clara Barton','"Let me go, let me go."');
    book = new Book("https://i.ibb.co/Y2rQkqK/35.png",'WWI','Clara Barton','"The paths of charity are over roadways of ashes."');
    book = new Book("https://i.ibb.co/dfH5fWj/36.png",'WWI','Clara Barton','"I always tried . . . to succor the wounded until medical aid and supplies could come up, I could run the risk."');
    book = new Book("https://i.ibb.co/p3Qf1Q5/37.png"  ,'WWI','Clara Barton','"Offering a hand up is not a hand-out."');
    book = new Book("https://i.ibb.co/p0RXZ0j/38.png" ,'WWI','Clara Barton','"I went to the Senate, accomplished nothing as usual."');
    book = new Book("https://i.ibb.co/JRTF8vF/39.png" ,'WWI','Clara Barton','"If I were to speak of war, it would not be to show you the glories of conquering armies but the mischief and misery they strew in their tracks."');
    book = new Book("https://i.ibb.co/LpQzC18/40.png",'WWI','Clara Barton','"I wonder if a soldier ever does mend a bullet hole in his coat?"');
    book = new Book("https://i.ibb.co/FV72XFD/42.png" ,'WWI','Clara Barton','"An institution or reform movement that is not selfish, must originate in the recognition of some evil that is adding to the sum of human suffering, or diminishing the sum of happiness."');
    book = new Book("https://i.ibb.co/b5RVSkJ/43.png" ,'WWI','Clara Barton','"When I reached (home), and looked in the mirror, my face was still the color of gunpowder, a deep blue. Oh yes I went to the front!"');
    book = new Book("https://i.ibb.co/pnJwTr0/45.png" ,'WWI','Clara Barton','"I am glad to know that somewhere they have learned their duty to their country, and have come up neither cowards nor traitors."');
    book = new Book("https://i.ibb.co/6JYk2CZ/46.png"  ,'WWI','Clara Barton','"You called us angels. Who opened the way for women to go and make it possible?"');
    book = new Book("https://i.ibb.co/HK0xy7g/47.png",'WWI','Clara Barton','"I don’t know how long it has been since my ear has been free from the roll of a drum. It is the music I sleep by and I love it."');
    book = new Book("https://i.ibb.co/GChjhWm/48.png",'WWI','Clara Barton','"Others are writing my biography, and let it rest as they elect to make it."');
    book = new Book("https://i.ibb.co/tbMTrbZ/49.png" ,'WWI','Clara Barton','"I have never for a moment lost sight of the humble life I was born to."');
    book = new Book("https://i.ibb.co/hcnCsdH/50.png",'WWI','Clara Barton',' "I write letters home for wounded soldiers, not political addresses."');
    book = new Book("https://i.ibb.co/QP98YZJ/51.png",'WWI','Clara Barton',' "My business is stanching blood and feeding fainting men; my post the open field between the bullet and the hospital."');
    book = new Book("https://i.ibb.co/vZqngCt/52.png" ,'WWI','Clara Barton','"I cannot afford the luxury of a closed mind."');
    book = new Book("https://i.ibb.co/sjNrCFs/53.png" ,'WWII','Clara Barton','"What could I do but go with the Civil War soldiers, or work for them and my country?"');
    book = new Book("https://i.ibb.co/HNBSztD/54.png",'WWII','Clara Barton','"The patriot blood of my father was warm in my veins."');
    book = new Book("https://i.ibb.co/JrKY10k/55.png" ,'WWII','Clara Barton','"I defy the tyranny of precedent. I go for anything new that might improve the past."');
    book = new Book("https://i.ibb.co/tqtY7Hb/56.png",'WWII','Clara Barton','"I have an almost complete disregard of precedent, and a faith in the possibility of something better. It irritates me to be told how things have always been done."');
    book = new Book("https://i.ibb.co/zXhnSYX/57.png",'WWII','Clara Barton','I shall remain here while anyone remains, and do whatever comes to my hand."');
    book = new Book("https://i.ibb.co/SNg863v/58.png",'WWII','Clara Barton','"People should not say that this or that is not worth learning, giving as their reason that it will not be put to use."');
    book = new Book("https://i.ibb.co/g4HqBKL/60.png",'WWII','Clara Barton','"I have lived my life, well and ill, always less well than I wanted it to be but it is, as it is, and as it has been; so small a thing, to have had so much about it!"');
    book = new Book("https://i.ibb.co/YQbYjjY/61.png",'WWII','Clara Barton',' "They can no more know what information they will need in the future than they will know the weather two hundred years from today."');
    book = new Book("https://i.ibb.co/P9WFN1s/63.png",'WWII','Clara Barton',' "The surest test of discipline is its absence."');
    book = new Book("https://i.ibb.co/BgQPhT9/59.png",'WWII','Clara Barton','"Economy, prudence, and a simple life are the sure masters of need, and will often accomplish that which, their opposites, with a fortune at hand, will fail to do."');
}