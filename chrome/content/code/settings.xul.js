// $Id$

var Redirector = Components.classes["@einaregilsson.com/redirector;1"].getService(Components.interfaces.nsISupports).wrappedJSObject;
const Cc = Components.classes;
const Ci = Components.interfaces;
const nsLocalFile = Components.Constructor("@mozilla.org/file/local;1", "nsILocalFile", "initWithPath");

var Settings = {

    lstRedirects: null,
    btnDelete   : null,
    btnEdit     : null,
    btnUp		: null,
    btnDown		: null,
	chkEnableRedirector : null,
	chkShowStatusBarIcon : null,
	chkShowContextMenu : null,
	chkEnableDebugOutput : null,
	
    onLoad : function() {
        try {
	        //Get references to controls
            this.lstRedirects = document.getElementById('lstRedirects');
            this.btnDelete = document.getElementById('btnDelete');
            this.btnEdit = document.getElementById('btnEdit');
            this.btnUp = document.getElementById('btnUp');
            this.btnDown = document.getElementById('btnDown');
            this.chkEnableRedirector = document.getElementById('chkEnableRedirector');
            this.chkShowStatusBarIcon = document.getElementById('chkShowStatusBarIcon');
            this.chkShowContextMenu = document.getElementById('chkShowContextMenu');
            this.chkEnableDebugOutput = document.getElementById('chkEnableDebugOutput');
            
            //Preferences
            this.setPrefs(Redirector.prefs);
            Redirector.prefs.addListener(this);

            //Redirect list
            this.lstRedirects.selType = 'single'; 
            this.template = document.getElementsByTagName('richlistitem')[0];
            this.lstRedirects.removeChild(this.template);
            this.addItemsToListBox(Redirector.list);

            this.strings = document.getElementById('redirector-strings');
            this.strings.getPluralized = function(id, number) {
				id += number == 1 ? 'Singular' : '';
				return this.getFormattedString(id, [number]);	
            };
        } catch(e) {
            alert(e);
        }
    },
    
    onUnload : function() {
		Redirector.prefs.removeListener(this);    
    },

    changedPrefs : function(prefs) {
    	this.setPrefs(prefs);
	},
	
	setPrefs : function(prefs) {
        this.chkEnableRedirector.setAttribute('checked', prefs.enabled);
        this.chkShowStatusBarIcon.setAttribute('checked', prefs.showStatusBarIcon);
        this.chkShowContextMenu.setAttribute('checked', prefs.showContextMenu);
        this.chkEnableDebugOutput.setAttribute('checked', prefs.debugEnabled);
	},
	
    addItemsToListBox : function(items) {

	    var item, row, value, newItem;
        
        for each (item in items) {
            newItem = this.template.cloneNode(true);

            newItem.getElementsByAttribute('name', 'dscrIncludePattern')[0].setAttribute('value', item.includePattern);
            newItem.getElementsByAttribute('name', 'dscrExcludePattern')[0].setAttribute('value', item.excludePattern);
            newItem.getElementsByAttribute('name', 'dscrRedirectTo')[0].setAttribute('value', item.redirectUrl);
            var checkEnabled = newItem.getElementsByAttribute('name', 'chkEnabled')[0];
            checkEnabled.setAttribute('checked', !item.disabled);
            newItem.setAttribute('class', item.disabled ? 'disabledRedirect' : '');
            newItem.item = item;
            this.lstRedirects.appendChild(newItem);
            newItem.setAttribute('selected', false)
        }
        
        //Enable, disable functionality
        this.lstRedirects.addEventListener('click', function(ev) { 
	        if (ev.originalTarget && ev.originalTarget.tagName == 'checkbox') {
		        var parent = ev.originalTarget.parentNode;
		        while (!parent.item) {
			     	parent = parent.parentNode;   
		        }
		        parent.item.disabled = !ev.originalTarget.hasAttribute('checked');
	            parent.setAttribute('class', parent.item.disabled ? 'disabledRedirect' : '');
		        Redirector.save();
	        }
        },false);
    },
    
    moveUp : function(){
        if (this.lstRedirects.selectedIndex <= 0) {
            return;
        }
        this.switchItems(this.lstRedirects.selectedIndex-1);
    },

    moveDown : function() {
        if (this.lstRedirects.selectedIndex == Redirector.list.length-1) {
            return;
        }
        this.switchItems(this.lstRedirects.selectedIndex);
    },

    switchItems : function(firstIndex) {
        var firstRedirect = Redirector.list[firstIndex];
        var secondRedirect = Redirector.list[firstIndex+1];
        Redirector.list[firstIndex] = secondRedirect;
        Redirector.list[firstIndex+1] = firstRedirect;
        var firstItem = this.lstRedirects.children[firstIndex];
        var secondItem = this.lstRedirects.children[firstIndex+1];
        this.lstRedirects.removeChild(secondItem);
        this.lstRedirects.insertBefore(secondItem, firstItem);
        Redirector.save();
        this.selectionChange();
    }, 
    
    setListItemValues : function(listItem, item){
        listItem.getElementsByAttribute('name', 'dscrIncludePattern')[0].setAttribute('value', item.includePattern);
        listItem.getElementsByAttribute('name', 'dscrExcludePattern')[0].setAttribute('value', item.excludePattern);
        listItem.getElementsByAttribute('name', 'dscrRedirectTo')[0].setAttribute('value', item.redirectUrl);
    },
    
    preferenceChange : function(event) {
	    Redirector.prefs[event.originalTarget.getAttribute('preference')] = event.originalTarget.hasAttribute('checked');
    },
    
    addRedirect : function() {
		var args = { saved : false, redirect : new Redirect() };
        window.openDialog("chrome://redirector/content/ui/editRedirect.xul", "redirect", "chrome,dialog,modal,centerscreen", args);
        if (args.saved) {
            this.addItemsToListBox([args.redirect]);
            Redirector.addRedirect(args.redirect);
            this.selectionChange();
        }
    },

    editRedirect : function() {

		if (this.lstRedirects.selectedIndex == -1) {
			return;
		}
		//.selectedItem is still there after it has been removed, that's why we have the .selectedIndex check above as well
        var listItem = this.lstRedirects.selectedItem;
        if (!listItem) {
            return;
        }
        var redirect = listItem.item;
		var args = { saved: false, "redirect":redirect.clone()};
        window.openDialog("chrome://redirector/content/ui/editRedirect.xul", "redirect", "chrome,dialog,modal,centerscreen", args);

        if (args.saved) {
	        redirect.copyValues(args.redirect);
            this.setListItemValues(listItem, redirect);
            Redirector.save();
            this.selectionChange();            
        }
    },
    
    deleteRedirect : function() {
        var index = this.lstRedirects.selectedIndex;

        if (index == -1) {
            return;
        }
        
        var text = this.strings.getString("deleteConfirmationText");
        var title = this.strings.getString("deleteConfirmationTitle");
        var reallyDelete = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService).confirm(null, title, text);
		if (!reallyDelete) {
			return;
		}		
		
        try {
            this.lstRedirects.removeChild(this.lstRedirects.children[index]);
            Redirector.deleteAt(index);
            this.selectionChange();
        } catch(e) {
            alert(e);
        }
    },

    selectionChange : function() {
	    if (!this.lstRedirects) {
		    return;
		}
        var index = this.lstRedirects.selectedIndex;

        this.btnEdit.disabled = (index == -1);
        this.btnDelete.disabled = (index == -1);
        this.btnUp.disabled = (index <= 0);
        this.btnDown.disabled = (index == -1 || index >= Redirector.list.length-1);
    },
    
    importExport : function(mode, captionKey, func) {
		//Mostly borrowed from Adblock Plus
		var picker = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
		picker.init(window, Redirector.getString(captionKey), mode);
		picker.defaultExtension = ".rdx";
		var dir = Redirector.prefs.defaultDir;
		if (dir) {
		    picker.displayDirectory = new nsLocalFile(dir);
		}
		picker.appendFilter(Redirector.getString('redirectorFiles'), '*.rdx');
		
		if (picker.show() == picker.returnCancel) {
		    return;
		}
		try {
			Redirector.prefs.defaultDir = picker.displayDirectory.path;
		    return func(picker.file);
		} catch (e) {
		    alert(e);
		}
    },
    
    export : function() {
		this.importExport(Ci.nsIFilePicker.modeSave, 'exportCaption', function(file) {
			Redirector.exportRedirects(file);
		});
    },
    
    import : function() {
		var result = this.importExport(Ci.nsIFilePicker.modeOpen, 'importCaption', function(file) {
			return Redirector.importRedirects(file);
		});

		var msg
		
		if (result.imported > 0) {
			msg = this.strings.getPluralized('importedMessage', result.imported);
			if (result.existed > 0) {
				msg += ', ' + this.strings.getPluralized('existedMessage',result.existed);	
			} else {
				msg += '.';	
			}
		} else if (result.imported == 0 && result.existed > 0) {
			msg = this.strings.getPluralized('allExistedMessage', result.existed);
		} else { //Both 0
			msg = this.strings.getString('importedNone');
		}

		var title = this.strings.getString("importResult");
        Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService).alert(null, title, msg);

		if (result.imported > 0) {
			var newlist = [];
			for (var i = Redirector.list.length-result.imported; i < Redirector.list.length; i++) {
				newlist.push(Redirector.list[i]);
			}				
        	this.addItemsToListBox(newlist);
		}
    }
};
