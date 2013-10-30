/*

This project is based on the SMINT which is done by Rober McCracken. 

you can find it out here:http://www.outyear.co.uk/smint/
*/


(function(){
	var targetAttr="lmint-target";
	$.fn.lmint = function( options ) {
	   var $navBar = $(this);
	   var originalTop = $navBar.position().top;
	   
		// adding a class to users div
		$navBar.addClass('smint')

		var settings = $.extend({
		            'scrollSpeed '  : 500
		}, options);

		//TODO: Improvement
		var $navItems = $(this).find(".navitem");
		
		var sectionLoc =[];//for example[{top:300, id:'section1'}, {top:500, id:'section2'}]
		$navItems.each(function(index){
			var id = this.getAttribute(targetAttr);
			var sectionTop = $("#"+id).position().top;
			sectionLoc.push({top:sectionTop, id: id});
		});
		
		var $window = $(window);
		
		//in the furture, maybe we can add a nother small navigation bar on the right-bottom corner(or left-bottom), that would be handy.
		var onNavItemChanged = function($pre, $current){
		    if($pre.length == 1 && $current.length ==1 && $pre[0] != $current[0]){
				$pre.removeClass("active");
				$current.addClass("active");
			}		
		}
						
		var lastScrollTop =0;
		var Direction ={up:1, down:2};
		var direction = Direction.down;
		var onScrolling = function(){
			var st = $(this).scrollTop();
			if (st > lastScrollTop) {
			    direction = Direction.down;
			} else if (st < lastScrollTop ){
			    direction = Direction.up;
			}
			
			var offset = st-lastScrollTop;
			if(offset <20 && offset>-20){
				return;
			}			

			lastScrollTop = st;
				
			var windowTopOffset = $window.scrollTop();
			if(windowTopOffset >= originalTop){
				$navBar.css({ 'position': 'fixed', 'top':0 }).addClass('fxd');	
			}else {
				$navBar.css({ 'position': 'absolute', 'top':originalTop}).removeClass('fxd'); 
			} 
			
			if(windowTopOffset + $window.height() == $(document).height()) {
				onNavItemChanged($navItems.filter(".active"),$navItems.last());
			}else{	
				if(direction === Direction.down){
					for(var i=sectionLoc.length -1;i>0;i--){
						var current = sectionLoc[i];
						var boundary = current.top-200;
						if(windowTopOffset>=boundary){
						onNavItemChanged($navItems.filter(".active"),$navItems.filter("["+targetAttr+"='"+current.id+"']"));
						break;
					 }
					}				
				}else{
					for(var i=0;i<sectionLoc.length;i++){
							var current = sectionLoc[i];
							var boundary = current.top+200;
							if(windowTopOffset<=boundary){
							onNavItemChanged($navItems.filter(".active"),$navItems.filter("["+targetAttr+"='"+current.id+"']"));
							break;
						}
					}
				}
			}
		}
		
		//Handle user's click on navigation items
		$navItems.on('click', function(e){
				
				// gets the height of the users div. This is used for off-setting the scroll so the menu doesnt overlap any content in the div they jst scrolled to
				var selectorHeight = $(this).height();   

        		// stops empty hrefs making the page jump when clicked
				e.preventDefault();

				// get the id selector( like '#section1') of the target section
		 		var targetIDSelector = $(this).attr(targetAttr);

				// gets the distance from top of the div class that matches your button id minus the height of the nav menu. This means the nav wont initially overlap the content.
				var goTo =  $("#"+targetIDSelector).offset().top -selectorHeight;

				// Scroll the page to the desired position!
				$("html, body").animate({ scrollTop: goTo },{ duration : settings.scrollSpeed , step: function(){ onScrolling();}});
				
		});	

		$window.scroll(function() {
				onScrolling();
		});      
		
		return $navBar;
	}
})();