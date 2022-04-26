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
    book = new Book("https://i.ibb.co/8jQc0zF/2022-04-18-6-34-42.png",'WWI','Judith Lewis Herman','“The conflict between the will to deny horrible events and the will to proclaim them aloud is the central dialectic of psychological trauma.”');
    book = new Book("https://i.ibb.co/JCJYppH/2022-04-18-6-32-26.png",'WWI',' Danielle Bernock','“Trauma is personal. It does not disappear if it is not validated. When it is ignored or invalidated the silent screams continue internally heard only by the one held captive. When someone enters the pain and hears the screams healing can begin.”');
    book = new Book("https://i.ibb.co/wsNwF2R/2022-04-18-6-19-08.png" ,'WWI','Jed Perl','Antoine Watteau, one of the most mysterious painters who ever lived, is the inspiration for this delightful investigation of the tangled relationship between art and life. Weaving together historical fact and personal reflections, the influential art critic Jed Perl reconstructs the amazing story of this pioneering bohemian artist who, although he died in 1721, when he was only thirty-six, has influenced innumerable painters and writers in the centuries since&mdash;and whose work continues to deepen our understanding of the place that love, friendship, and pleasure have in our daily lives.');
    book = new Book("https://i.ibb.co/Fnfz86Y/2022-03-31-9-23-52.png" ,'WWI','Tiffany Madison','“The problem with having problems is that ‘someone’ always has it worse.”');
    book = new Book("https://i.ibb.co/hBVCb4T/2.jpg",'Brave New World','WWI','Lori Goodwin','“When we feel weak, we drop our heads on the shoulders of others. Do not get mad when someone does that. Be honored. For that person trusted you enough to, even if subtly, ask you for help.”');
    book = new Book("https://i.ibb.co/hK0dwjq/2022-04-18-6-17-19.png" ,'WWI','Judith Lewis Herman','“The ORDINARY RESPONSE TO ATROCITIES is to banish them from consciousness. Certain violations of the social compact are too terrible to utter aloud: this is the meaning of the word unspeakable.');
    book = new Book("https://i.ibb.co/pvgKZt5/2022-04-18-8-55-16.png",'WWI','Susan Pease Banitt','“PTSD is a whole-body tragedy, an integral human event of enormous proportions with massive repercussions.”');
    book = new Book("https://i.ibb.co/Z17hzsy/2022-04-18-8-56-26.png" ,'WWI','Lori Goodwin','“Even in times of trauma, we try to maintain a sense of normality until we no longer can. That, my friends, is called surviving. Not healing. We never become whole again ... we are survivors. If you are here today... you are a survivor. But those of us who have made it thru hell and are still standing? We bare a different name: warriors.”');
    book = new Book("https://i.ibb.co/kgt6Jgt/2022-04-18-8-57-17.png",'WWI',' S. Kelley Harrell','“We do not heal in isolation, but in community.”');
    book = new Book("https://i.ibb.co/YhfByJB/2022-04-18-8-58-21.png" ,'WWI','Sierra D. Waters, Debbie.','“No amount of me trying to explain myself was doing any good. I did not even know what was going on inside of me, so how could I have explained it to them?”');
    book = new Book("https://i.ibb.co/20257Hn/2022-04-18-8-59-04.png" ,'WWII','Bessel A. van der Kolk','“Unlike other forms of psychological disorders, the core issue in trauma is reality.”');
    book = new Book("https://i.ibb.co/f8LXt4x/2022-04-18-9-00-35.png" ,'WWII','Peter A. Levine','“In response to threat and injury, animals, including humans, execute biologically based, non-conscious action patterns that prepare them to meet the threat and defend themselves. The very structure of trauma, including activation, dissociation and freezing are based on the evolution of survival behaviors. When threatened or injured, all animals draw from a "library" of possible responses. We orient, dodge, duck, stiffen, brace, retract, fight, flee, freeze, collapse, etc. All of these coordinated responses are somatically based- they are things that the body does to protect and defend itself. It is when these orienting and defending responses are overwhelmed that we see trauma.');
    book = new Book("https://i.ibb.co/KsXMRZ1/2022-04-18-9-04-50.png" ,'WWII','Amanda Steele',' “The blade sings to me. Faintly, so soft against my ears, its voice calms my worries and tells me that one touch will take it all away. It tells me that I just need to slide a long horizontal cut, and make a clean slice. It tells me the words that I have been begging to hear: this will make it ok.”');
    book = new Book("https://i.ibb.co/KqbW1SR/2022-04-18-9-06-06.png" ,'WWII',' Jessica Stern',' “Some of their lives seem to flow in a narrative; mine had many stops and starts. That is what trauma does. It interrupts the plot. You cannot process it because it doesnot fit with what came before or what comes afterwards.”');
    book = new Book("https://i.ibb.co/DL7hNdd/2022-04-18-9-06-59.png" ,'WWII','Asa Don Brown',' “Alone with thoughts of what should have long been forgotten, I let myself be carried away into the silent screams of delirium.”');
    book = new Book("https://i.ibb.co/Mhqbvb7/2022-04-18-9-07-25.png",'WWII','Michael Connelly','“You cannot patch a wounded soul with a Band-Aid.” ');
    book = new Book("https://i.ibb.co/qNCJ6Xw/2022-04-18-9-08-34.png" ,'WWII','Carolyn Spring','“Triggers are like little psychic explosions that crash through avoidance and bring the dissociated, avoided trauma suddenly, unexpectedly, back into consciousness.”');
    book = new Book("https://i.ibb.co/DpNQr6c/2022-04-18-9-09-26.png" ,'WWII','Jan Karon',' “In World War One, they called it shell shock. Second time around, they called it battle fatigue. After Nam, it was post-traumatic stress disorder.”');
    book = new Book("https://i.ibb.co/j8ZyXP4/2022-04-18-9-11-17.png" ,'WWII','Clint Van Winkle',' “Who supports the troops? The troops support the troops.”');
    book = new Book("https://i.ibb.co/7yLv7QP/2022-04-18-9-12-16.png" ,'WWII',' M.B. Wilmot','“The open road. Seemingly my only friend for years upon end since leaving war. The road embraced me, let me breathe, and more importantly, did not judge me.”');
    book = new Book("https://i.ibb.co/3N33QL8/2022-04-18-9-13-11.png" ,'WWII',' James M. McGarrity','“Do not step off the road There might be another one!”');
    book = new Book("https://i.ibb.co/YjJtRT7/2022-04-18-9-15-11.png" ,'WWII','Stanley Victor Paskavich','“SE Self Execution the act will always be greater than the pain.”');
    book = new Book("https://i.ibb.co/Qb62m7F/2022-04-18-9-15-56.png" ,'WWII','Asa Don Brown','“Childhood trauma does not come in one single package.”');
    book = new Book("https://i.ibb.co/RSqfwYn/2022-04-18-9-19-53.png" ,'WWII',' Jonathan Harnisch','“I keep moving ahead, as always, knowing deep down inside that I am a good person and that I am worthy of a good life.');
    book = new Book("https://i.ibb.co/k6MnFbD/2022-04-18-9-22-01.png" ,'WWII','Stanley Victor Paskavich','“Been under treatment for PTSD and bipolar since 1992. I’m not ashamed of my illness. I’ve been shunned by many and I feel for those shunned, too.”');
    book = new Book("https://i.ibb.co/RvShBYd/2022-04-18-9-23-51.png",'WWII','Sara Niles','“It was difficult to find information because Post Traumatic Stress Disorder was called shell shock during W.W.II, and when Vietnam Vets were found to suffer from the same symptoms after exposure to traumatic war scenes, a study was embarked upon that ended with the new, more appropriate name in 1980. Thomas was diagnosed with P.T.S.D. shortly afterwards, before the term P.T.S.D. was common.”');
    book = new Book("https://i.ibb.co/kGLC6Kb/2022-04-18-9-26-30.png" ,'WWII','Shreve Gould','“A Paradigm shift is that moment we let go of one belief or idea to grab a new belief or idea. For many, PTSD is a treatable medical condition is a paradigm shift.”');
    book = new Book("https://i.ibb.co/SPQw35b/2022-04-18-9-27-13.png" ,'WWII','Erich Maria Remarque','“The war has ruined us for everything.”');
    book = new Book("https://i.ibb.co/mTysNK5/2022-04-18-9-28-16.png" ,'WWII','Jacob Lasher','“Am I one of your demons, too? I never meant to hurt you.”');
    book = new Book("https://i.ibb.co/J5b1Qrz/2022-04-18-9-28-54.png" ,'WWII','Kayo K.','“When you get entangled inside the complexities of your mind in a certain way, from then on, you have to earn your "every day".”');
}