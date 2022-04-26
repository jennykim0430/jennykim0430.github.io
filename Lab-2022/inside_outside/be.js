
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
    book = new Book("https://i.ibb.co/SRggSbn/14.png" ,'WWI','Frederick C. Blesse','"No guts, no glory."');
    book = new Book("https://i.ibb.co/GsmNnyR/12.png",'WWI','Winston Churchill','"We sleep safely at night because rough men stand ready to visit violence on those who would harm us."');
    book = new Book("https://i.ibb.co/KGQLgsG/2022-04-24-6-25-15.png" ,'WWI','George Colman','"Praise the bridge that carried you over."');
    book = new Book("https://i.ibb.co/1sXsHMv/7.png" ,'WWI','David G. Farragut','"Damn the torpedoes, full speed ahead."');
    book = new Book("https://i.ibb.co/5rfTw7N/2022-04-24-6-25-27.png",'WWI','Dwight D. Eisenhower','"Neither a wise nor a brave man lies down on the tracks of history to wait for the train of the future to run over him.Leadership is the art of getting someone else to do something you want done because he wants to do it.Only our individual faith in freedom can keep us free.The best morale exists when you never hear the word mentioned. When you hear it it is usually lousy.');
    book = new Book("https://i.ibb.co/7XS6myY/2022-04-24-6-26-14.png"  ,'WWI','Giuseppe Garibaldi','"I offer neither pay, nor quarters, nor food; I offer only hunger, thirst, forced marches, battles, and death. Let him who loves his country with his heart, and not merely his lips, follow me."');
    book = new Book("https://i.ibb.co/V92hh5P/6.png",'WWI','David Hackworth','"If you find yourself in a fair fight, you did not plan your mission properly."');
    book = new Book("https://i.ibb.co/zX0vT0y/2022-04-24-6-25-49.png"  ,'WWI','Nathan Hale','I only regret that I have but one life to give for my country.');
    book = new Book("https://i.ibb.co/SXXcFqM/2022-04-24-6-35-23.png",'WWI','Douglas MacArthur','"Whoever said the pen is mightier than the sword obviously never encountered automatic weapons."');
    book = new Book("https://i.ibb.co/ygvjRhS/8.jpg" ,'WWI','George S. Patton Jr.','"Live for something rather than die for nothing."');
    book = new Book("https://i.ibb.co/j46fmV2/9.png"  ,'WWI','Oliver Hazard Perry','"We have met the enemy and they are ours."');
    book = new Book("https://i.ibb.co/HhPhzvy/10.jpg" ,'WWIWWI','Colin Powell','"There are no secrets to success. It is the result of preparation, hard work, learning from failure."');
    book = new Book("https://i.ibb.co/9pNFBj3/11.png" ,'WWII','Norman Schwarzkopf, Jr.','"The truth of the matter is that you always know the right thing to do. The hard part is doing it."');
    book = new Book("https://i.ibb.co/G5qj26g/2022-04-24-6-24-55.png"  ,'WWII','William Tecumseh Sherman','"War is hell."');
    book = new Book("https://i.ibb.co/Zd0NtSz/17.png",'WWII','Harry S. Truman','"A leader is the man who has the ability to get other people to do what they do not want to do, and like it."');
    book = new Book("https://i.ibb.co/6XJg5wt/2022-04-24-6-23-36.png",'WWII','Arthur Wellesley, First Duke of Wellington (1769-1852)','"I do not know what effect these men will have upon the enemy, but, by God, they terrify me."');
    book = new Book("https://i.ibb.co/3BdpQvF/15.png" ,'WWII','William C. Westmoreland','"The military do not start wars. Politicians start wars."');
    book = new Book("https://i.ibb.co/LdWqQjq/18.png" ,'WWII','Heraclitus','Out of every one hundred men, ten should not even be there, eighty are just targets, nine are the real fighters, and we are lucky to have them, for they make the battle. Ah, but the one, one is a warrior, and he will bring the others back.');
    book = new Book("https://i.ibb.co/JCBdGYH/19.png" ,'WWII','Martin Luther King Jr.','“If a man hasn’t discovered something that he will die for, he isn’t fit to live.” ');
    book = new Book("https://i.ibb.co/4WYTmrX/20.png" ,'WWII','George Orwell',' “We sleep peaceably in our beds at night only because rough men stand ready to do violence on our behalf.”');
    book = new Book("https://i.ibb.co/z2gPxKM/21.png" ,'WWII','Alexander Hamilton','"Those who stand for nothing fall for anything.”');
    book = new Book("https://i.ibb.co/Mp11Zzp/22.png" ,'WWII','Mary Roach','”Heroism doesn’t always happen in a burst of glory. Sometimes small triumphs and large hearts change the course of history.”');
    book = new Book("https://i.ibb.co/xHppvHW/23.png",'WWII',' Douglas MacArthur','”Whoever said the pen is mightier than the sword obviously never encountered automatic weapons.” ');
    book = new Book("https://i.ibb.co/wrMRv2X/24.png",'WWII','Dwight D. Eisenhower','”Only our individual faith in freedom can keep us free.”');
    book = new Book("https://i.ibb.co/4WgdRfb/25.png"  ,'WWII','The Duke of Wellington','”I don’t know what effect these men will have upon the enemy, but, by God, they terrify me.” ');
    book = new Book("https://i.ibb.co/6mpHz58/26.png",'WWII','David Hackworth','”If you find yourself in a fair fight, you didn’t plan your mission properly.” ');
    book = new Book("https://i.ibb.co/HqBvvvr/27.png",'WWII','Major Gen. Frederick C. Blesse','”No guts, no glory.”');
    book = new Book("https://i.ibb.co/zmct8hv/28.png"  ,'WWII','Thomas M Smith','”This country has not seen and probably will never know the true level of sacrifice of our veterans”. As a civilian, I owe an unpayable debt to all our military. Going forward let’s not send our servicemen and women off to war or conflict zones unless it is overwhelmingly justifiable and on moral high ground.”');
    book = new Book("https://i.ibb.co/FYZqkMy/29.png" ,'WWII',' Winston Churchill',' “Never give in, never give in, never, never, never, never—in nothing, great or small, large or petty—never give in except to convictions of honor and good sense.”');
    book = new Book("https://i.ibb.co/HKCRghp/30.webp" ,'WWII','British Special Air Service (SAS)','“Who dares, wins. Who sweats, wins. Who plans, wins.”');
}