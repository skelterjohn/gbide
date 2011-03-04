/* 
Copyright: Paul Hanlon

Released under the MIT/BSD licence which means you can do anything you want 
with it, as long as you keep this copyright notice on the page 
*/

var jq_defaults = {
	openImg: "jqtreetable/images/tv-collapsable.gif",
	shutImg: "jqtreetable/images/tv-expandable.gif",
	leafImg: "jqtreetable/images/tv-item.gif",
	lastOpenImg: "jqtreetable/images/tv-collapsable-last.gif",
	lastShutImg: "jqtreetable/images/tv-expandable-last.gif",
	lastLeafImg: "jqtreetable/images/tv-item-last.gif",
	vertLineImg: "jqtreetable/images/vertline.gif",
	blankImg: "jqtreetable/images/blank.gif"
};

(function(jq) {
    jq.fn.jqTreeTable = function(map, options) {
    	var opts = jq.extend({openImg:"",shutImg:"",leafImg:"",lastOpenImg:"",lastShutImg:"",lastLeafImg:"",vertLineImg:"",blankImg:"",collapse:false,column:0,striped:false,highlight:false,state:true},options),
    	
    	mapa=[],mapb=[],tid=this.attr("id"),collarr=[],
    
    	stripe= function(){
    		if(opts.striped){
    			$("#"+tid+" tr:visible").filter(":even").addClass("even").end().filter(":odd").removeClass("even");
    		}
    	},
    
    	//Recursively build up the text for the images that make it work
    	buildText = function(parno, preStr) {
    		var mp=mapa[parno], ro=0, pre="", pref, img;
    		for (var y=0,yl=mp.length;y<yl;y++) {
    			ro = mp[y];
     
    			//It's a parent as well. Build its string and move on to it's children
				if (mapa[ro]) {
					pre=(y==yl-1)? opts.blankImg: opts.vertLineImg;
					img=(y==yl-1)? opts.lastOpenImg: opts.openImg;
					mapb[ro-1] = preStr + '<img src="'+img+'" class="parimg" id="'+tid+ro+'">';
					pref = preStr + '<img src="'+pre+'" class="preimg">';
					arguments.callee(ro, pref);
				} else {//it's a child
    				img = (y==yl-1)? opts.lastLeafImg: opts.leafImg;//It's the last child, It's child will have a blank field behind it
    				mapb[ro-1] = preStr + '<img src="'+img+'" class="ttimage" id="'+tid+ro+'">';
    			}
    		}
    	},
    
    	//Expands immediate children, and their uncollapsed children
    	expandKids = function(num, last) {
    		jq("#"+tid+num).attr("src", (last)? opts.lastOpenImg: opts.openImg);//
     
    		for (var x=0, xl=mapa[num].length;x<xl;x++) {
    			var mnx = mapa[num][x];
    			jq("#"+tid+mnx).parents("tr").removeClass("collapsed");
     
    			//If it is a parent and its number is not in the collapsed array
    			if (mapa[mnx] && opts.state && jq.inArray(mnx, collarr)<0) {
    				//Expand it. More intuitive way of displaying the tree
    				arguments.callee(mnx,(x==xl-1));
    			}
    		}
    	},
    
    	//Recursively collapses all children and their children and change icon
    	collapseKids = function(num, last) {
    		jq("#"+tid+num).attr("src", (last)? opts.lastShutImg: opts.shutImg);
     
    		for (var x=0, xl=mapa[num].length;x<xl;x++) {
    			var mnx = mapa[num][x];
    			jq("#"+tid+mnx).parents("tr").addClass("collapsed");
     
    			if (mapa[mnx]) {//If it is a parent
    				arguments.callee(mnx,(x==xl-1));
    			}
    		}
    	},
    
    	//Resets the collapse array
    	creset = function(num, exp){
    		var o = (exp)? collarr.splice(jq.inArray(num, collarr), 1): collarr.push(num);
    		cset(tid,collarr);
    	},
    
    	cget = function(n){
    		var v='',c=' '+document.cookie+';',s=c.indexOf(' '+n+'=');
    		if (document.cookie==(n+'=')) {
    			s=-1;
    		}
    		if (s>=0) {
    			s+=n.length+2;
    			v=(c.substring(s,c.indexOf(';',s))).split("|");
    		}
    		return v||0;
    	},
    
    	cset = function (n,v) {
    		jq.unique(v);
    		//something about cookies is broken
    		//document.cookie = n+"="+v.join("|")+";";
    	};
    
    	//From map of parents, get map of kids
    	for (var x=0,xl=map.length; x<xl;x++) {
    		num = map[x];
    		if (!mapa[num]){
    			mapa[num]=[];
    		}
    		mapa[num].push(x+1);
    	}
     
    	buildText(0,"");
     
    	//Inject the images into the column to make it work
    	jq("tr", this).each(function(i) {
    		jq(this).children("td").eq(opts.column).prepend(mapb[i]);
    		jq(this).children("td").eq(4).prepend("["+((mapa[i+1])? mapa[i+1]: "Child")+"]");//REMOVE THIS for production
    	});
     
    	collarr = cget(tid) || opts.collapse || collarr;
     
    	if (collarr.length) {
    		cset(tid,collarr);
    		for (var y=0,yl=collarr.length;y<yl;y++) {
    			collapseKids(collarr[y],($("#"+collarr[y]+ " .parimg").attr("src")==opts.lastOpenImg));
    		}
    	}
     
    	stripe();
     
    	jq(".parimg", this).each(function(i) {
    		var jqt = jq(this),last;
    		jqt.click(function() {
    			
    			//Number of the row
    			var num = parseInt(jqt.attr("id").substr(tid.length));
    				  
    			//If the table row directly below is collapsed
    			if (jqt.parents("tr").next().is(".collapsed")) {
    				//Then expand all children not in collarr
    				expandKids(num, (jqt.attr("src")==opts.lastShutImg));
    				if(opts.state) {
    					creset(num,true);
    				}//If state is set, store in cookie
    			} else {//Collapse all and set image to opts.shutImg or opts.lastShutImg on parents
    				collapseKids(num, (jqt.attr("src")==opts.lastOpenImg));
    				if(opts.state) {
    					creset(num,false);
    				}//If state is set, store in cookie
    			}
    			stripe();//Restripe the rows
    		});
    	});
     
    	if (opts.highlight){//This is where it highlights the rows
    		jq("tr", this).hover(
    			function() { jq(this).addClass("over"); },
    			function() { jq(this).removeClass("over"); }
    		);
        };
    };
	return this;
})(jQuery);

