
(function($) {  
	var self = null;
 	
	$.fn.liveUpdate = function(list) {	
		return this.each(function() {
			new $.liveUpdate(this, list);
		});
	};
	
	$.liveUpdate = function (e, list) {
		this.field = $(e);
		this.list  = $('#' + list);
		if (this.list.length > 0) {
			this.init();
		}
	};
	
	$.liveUpdate.prototype = {
		init: function() {
			var self = this;
			this.setupCache();
			this.field.parents('form').submit(function() { return false; });
			this.field.keyup(function() { self.filter(); });
			self.filter();
		},
		
		filter: function() {
			if ($.trim(this.field.val()) == '') { this.list.children('li').show(); return; }
			this.displayResults(this.getScores(this.field.val().toLowerCase()));
		},
		
		setupCache: function() {
			var self = this;
			this.cache = [];
			this.rows = [];
			this.list.children('li').each(function() {
				self.cache.push(this.innerHTML.toLowerCase());
				self.rows.push($(this));
			});
			this.cache_length = this.cache.length;
		},
		
		displayResults: function(scores) {
			var self = this;
			this.list.children('li').hide();
			$.each(scores, function(i, score) { self.rows[score[1]].show(); });
		},
		
		getScores: function(term) {
			var scores = [];
			for (var i=0; i < this.cache_length; i++) {
				var score = this.cache[i].score(term);
				if (score > 0) { scores.push([score, i]); }
			}
			return scores.sort(function(a, b) { return b[0] - a[0]; });
		}
	}
})(jQuery);
String.prototype.score = function(abbreviation,offset) {
  offset = offset || 0 // TODO: I think this is unused... remove
 
  if(abbreviation.length == 0) return 0.9
  if(abbreviation.length > this.length) return 0.0

  for (var i = abbreviation.length; i > 0; i--) {
    var sub_abbreviation = abbreviation.substring(0,i)
    var index = this.indexOf(sub_abbreviation)


    if(index < 0) continue;
    if(index + abbreviation.length > this.length + offset) continue;

    var next_string       = this.substring(index+sub_abbreviation.length)
    var next_abbreviation = null

    if(i >= abbreviation.length)
      next_abbreviation = ''
    else
      next_abbreviation = abbreviation.substring(i)
 
    var remaining_score   = next_string.score(next_abbreviation,offset+index)
 
    if (remaining_score > 0) {
      var score = this.length-next_string.length;

      if(index != 0) {
        var j = 0;

        var c = this.charCodeAt(index-1)
        if(c==32 || c == 9) {
          for(var j=(index-2); j >= 0; j--) {
            c = this.charCodeAt(j)
            score -= ((c == 32 || c == 9) ? 1 : 0.15)
          }

        
        } else {
          score -= index
        }
      }
   
      score += remaining_score * next_string.length
      score /= this.length;
      return score
    }
  }
  return 0.0
}

