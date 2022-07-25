/*
* based on:
* jQuery RTE plugin 0.5.1 - create a rich text form for Mozilla, Opera, Safari and Internet Explorer
*
* Copyright (c) 2009 Batiste Bieler
* Distributed under the GPL Licenses.
* Distributed under the The MIT License.

* Copyright (c) 2009 Bernd Eickhoff
* I have done slight changes to suit my particular needs.
* Distributed under the authors original licenses.
*/

"use strict";
// define the rte light plugin
var pasteEnabled = false;
function enablePaste($this) {
    //$("div[contenteditable=true]").off('paste').on('paste', function (e) {
    // $this.off('paste').on('paste', function (e) {
    $this.addEventListener('paste', e => {
        e.preventDefault();
        console.log(e);
        // var text = e.originalEvent.clipboardData ? e.originalEvent.clipboardData.getData('text/plain') : window.clipboardData.getData('Text');
        var text = e.clipboardData ? e.clipboardData.getData('text/plain') : window.clipboardData.getData('Text');
        _insertText(text);
    });

    function _insertText(text) {
        // use insertText command if supported
        if (document.queryCommandSupported('insertText')) {
            document.execCommand('insertText', false, text);
        }
        // or insert the text content at the caret's current position
        // replacing eventually selected content
        else {
            var range = document.getSelection().getRangeAt(0);
            range.deleteContents();
            var textNode = document.createTextNode(text);
            range.insertNode(textNode);
            range.selectNodeContents(textNode);
            range.collapse(false);

            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
}

function enablePaste1() {
    var isIE = false;
    try {
        isIE = isInternetExplorer();
    } catch (e) {

    }
    //consoleLog('IE: ' + isIE);
    if (!pasteEnabled && !isIE) {
        pasteEnabled = true;
        $(document).on('paste', function (e) {
            e.preventDefault();
            //if (!opts.enablePaste) {
            var text = '';
            if (e.clipboardData || e.originalEvent.clipboardData) {
                text = (e.originalEvent || e).clipboardData.getData('text/plain');
            } else if (window.clipboardData) {
                text = window.clipboardData.getData('Text');
            }
            if (document.queryCommandSupported('insertText')) {
                document.execCommand('insertText', false, text);
            } else {
                return document.execCommand('paste', false, text);
            }
        });
    }
}
const BaseRichtext = {

    rte: function (target, options) {

        // $.fn.rte.html = function (fakeArea) {
        //     return fakeArea.innerHTML;
        // };

        const rte_defaults = {
            media_url: "",
            content_css_url: "rte.css",
            dot_net_button_class: null,
            max_height: 350,
            autoscroll: false,
            height: 350,
            enablePaste: false
        };

        // build main options before element iteration
        // var opts = $.extend($.fn.rte.defaults, options);
        var opts = rte_defaults;
        //enablePaste();

        //console.info(opts.height);
        // iterate and construct the RTEs
        init(target);
        function init(tar) {
            const textarea = tar;// $(this);
            var fakeArea;

            const element_id = textarea.id;// textarea.attr("id");

            // enable design mode
            function enableDesignMode() {
                let content = textarea.value; //.val();

                // Mozilla needs this to display caret
                // if ($.trim(content) === '') {
                if (content.trim() === '') {
                    content = '<br />';
                }

                // already created? show/hide
                // if (fakeArea) {
                    
                //     enablePaste($(fakeArea));

                //     $(fakeArea).contents().find("body").html(content);
                //     $(fakeArea).show();
                //     $("#toolbar-" + element_id).remove();
                //     textarea.before(toolbar());
                //     return true;
                // }

                // for compatibility reasons, need to be created this way
                fakeArea = document.createElement("div");
                fakeArea.innerHTML = '';
                fakeArea.frameBorder = 0;
                fakeArea.frameMargin = 0;
                fakeArea.framePadding = 0;
                fakeArea.contentEditable = true;
                // enablePaste($(fakeArea));
                enablePaste(fakeArea);


                let hgt = opts.height;
                if (hgt === undefined || hgt.length === 0) {
                    hgt = '300px';
                } else {
                    hgt = hgt + 'px';
                }
                fakeArea.style['min-height'] = hgt;
                //fakeArea.style.border = 'solid thin #ced4da';
                // if (textarea.attr('id')) {
                if (textarea.id) {
                    fakeArea.id = element_id + '_iframe';
                }
                // document.getElementById('').setAttribute
                textarea.setAttribute('data-zbfs-richtextid', fakeArea.id);
                //if (textarea.attr('name'))
                //    fakeArea.title = textarea.attr('name');
                if (content.trim().length > 0) {
                    fakeArea.innerHTML = content;
                }
                //fakeArea.style['font-size'] = '12pt';
                //fakeArea.style['font-family'] = 'Arial';
                //fakeArea.style['border-radius'] = '0.25em';
                //fakeArea.style.padding = '2px 5px 2px 5px';
                fakeArea.classList.add('rich-textbox');

                textarea.after(fakeArea);

                textarea.before(toolbar());

                textarea.style['display'] = 'none'; //.hide();
                fakeArea.val = function () { return this.innerHTML; };
                // fakeArea.addEventListener('keypress', abkChecker);
                // $(fakeArea).focusin(function () {
                fakeArea.addEventListener('focusin', function () {
                    //consoleLog('focusIn');
                    this.classList.add('focus');
                })
                fakeArea.addEventListener('focusout', function () {
                    var content = fakeArea.innerHTML;
                    if (content != textarea.value) {
                        textarea.value = content;
                        // textarea.change();
                    }
                    this.classList.remove('focus');
                });
            }

            //<p class='d-none'>\
            //            <select class='blockstyle form-control md-width' aria-label='Formatieren' title='Formatieren'>\
            //                <option value=''>Block style</option>\
            //                <option value='p'>Paragraph</option>\
            //                <option value='h3'>Title</option>\
            //                <option value='address'>Address</option>\
            //            </select>\
            //            <select class='fontfamily form-control md-width' aria-label='Schrifart' title='Schriftart'>\
            //                <option value=''>--</option>\
            //                <option value='Arial'>Arial</option>\
            //                <option value='New Times Roman'>New Times Roman</option>\
            //            </select>\
            //            <select class='fontsize d-none form-control md-width' aria-label='Schriftgröße' title='Schriftgröße'>\
            //                <option value=''>--</option>\
            //                <option value='12'>12</option>\
            //                <option value='32'>32</option>\
            //            </select>\
            //        </p>\

            // create toolbar and bind events to it's elements
            function createElement(tagName, options) {
                const tag = document.createElement(tagName);
                if (options != undefined) {
                    if (options.class != undefined)
                        tag.className = options.class;
                    if (options.id != undefined)
                        tag.id = options.id;
                    if (options.html != undefined)
                        tag.innerHTML = options.html;
                    if (options.href != undefined)
                        tag.href = options.href;
                    if (options.value != undefined)
                        tag.value = options.value;
                }
                return tag;
            }
            function toolbar() {
                const toolbar = createElement('div', { class: 'rte-toolbar', id: `toolbar-${element_id}` });
                const block = createElement('div', { class: 'inlineblock' })
                let btnGroup = createElement('div', { class: 'btn-group' });
                const btnBold = createElement('a', { class: 'bi bi-type-bold', html: '', href: '#' });
                const btnItalic = createElement('a', { class: 'bi bi-type-italic', html: '', href: '#' });
                const btnUnderline = createElement('a', { class: 'bi bi-type-underline', html: '', href: '#' });
                btnGroup.appendChild(btnBold); btnGroup.appendChild(btnItalic); btnGroup.appendChild(btnUnderline);
                block.appendChild(btnGroup);

                btnGroup = createElement('div', { class: 'btn-group' });
                const justifyLeft = createElement('a', { class: 'justifyLeft bi bi-justify-left', html: '', href: '#' });
                const justifyCenter = createElement('a', { class: 'justifyCenter bi bi-justify', html: '', href: '#' });
                const justifyRight = createElement('a', { class: 'justifyRight bi bi-justify-right', html: '', href: '#' });
                // const justifyFull = createElement('a', { class: 'justifyFull', html: 'Full', href: '#' });
                btnGroup.appendChild(justifyLeft); btnGroup.appendChild(justifyCenter);
                btnGroup.appendChild(justifyRight);
                // btnGroup.appendChild(justifyFull);
                block.appendChild(btnGroup);

                btnGroup = createElement('div', { class: 'btn-group' });
                const undo = createElement('a', { class: 'undo bi bi-arrow-counterclockwise', html: '', href: '#' });
                const redo = createElement('a', { class: 'redo bi bi-arrow-clockwise', html: '', href: '#' });
                btnGroup.appendChild(undo); btnGroup.appendChild(redo);
                block.appendChild(btnGroup);

                btnGroup = createElement('div', { class: 'btn-group' });
                const unorderedlist = createElement('a', { class: 'undo bi bi-list-ul', html: '', href: '#' });
                const orderedlist = createElement('a', { class: 'undo bi bi-list-ol', html: '', href: '#' });
                const link = createElement('a', { class: 'bi bi-link', html: '', href: '#' });
                btnGroup.appendChild(unorderedlist); btnGroup.appendChild(orderedlist);
                btnGroup.appendChild(link);
                block.appendChild(btnGroup);

                const select = createElement('select', { class: '' });
                const option1 = createElement('option', { class: '', html: 'Arial', value: 'Arial' });
                const option2 = createElement('option', { class: '', html: 'Times New Roman', value: 'Times New Roman' });
                select.appendChild(option1); select.appendChild(option2);
                block.appendChild(select);

                const selectFont = createElement('select', { class: '' });
                const optionFont12 = createElement('option', { class: '', html: '12', value: '12' });
                const optionFont14 = createElement('option', { class: '', html: '14', value: '14' });
                // const orderedlist = createElement('a', { class: 'undo bi bi-list-ol', html: '', href: '#' });
                // const link = createElement('a', { class: 'bi bi-link', html: '', href: '#' });
                selectFont.appendChild(optionFont12); selectFont.appendChild(optionFont14);
                block.appendChild(selectFont);

                toolbar.appendChild(block);
                var btnclasses = ' btn btn-sm btn-outline-secondary btn-flat ';
                var tb =
                    "<div class='rte-toolbar' style=\"margin-bottom:4px;\" id='toolbar-" + element_id + "'>\
                    <div class='inlineblock'>\
                        <div class='btn-group' role='group' >\
                            <a href='#' class='bold " + btnclasses + "' title='Fett'><b>F</b></a>\
                            <a href='#' class='italic " + btnclasses + "' title='Kursiv'><i>K</i></a>\
                            <a href='#' class='underline " + btnclasses + "' title='Unterstrichen'><u>U</u></a>&nbsp;\
                        </div>\
                        <div class='btn-group d-none' role='group' >\
                            <a href='#' class='justifyLeft " + btnclasses + "' title='Left'><span class='fa fa-align-left'></span><span class='sr-only'>Linksbündig</span></a>&nbsp;\
                            <a href='#' class='justifyCenter " + btnclasses + "' title='Center'><span class='fa fa-align-center'></span><span class='sr-only'>Zentrieren</span></a>&nbsp;\
                            <a href='#' class='justifyRight " + btnclasses + "' title='Right'><span class='fa fa-align-right'></span><span class='sr-only'>Rechtsbündig</span></a>&nbsp;\
                            <a href='#' class='justifyFull " + btnclasses + "' title='Full'><span class='fa fa-align-justify'></span><span class='sr-only'>Blocksatz</span></a>&nbsp;\
                        </div>\
                        <div class='btn-group d-none' role='group' >\
                            <a href='#' class='undo btn btn-sm btn-secondary btn-flat' title='Undo'><span class='fa fa-arrow-left'></span><span class='sr-only'>Rückgängig</span></a>&nbsp;\
                            <a href='#' class='redo btn btn-sm btn-secondary btn-flat' title='Redo'><span class='fa fa-arrow-right'></span><span class='sr-only'>Wiederholen</span></a>&nbsp;\
                        </div>\
                        <a href='#' class='unorderedlist " + btnclasses + "' title='Unnummerierte Liste'><span class='fa fa-list' aria-hidden='true'></span><span class='sr-only'>Liste Unnummeriert</span></a>\
                        <a href='#' class='orderedlist " + btnclasses + "' title='Nummerierte Liste'><span class='fa fa-list-ol' aria-hidden='true'></span><span class='sr-only'>Liste Nummeriert</span></a>\
                        <a href='#' class='d-none link " + btnclasses + "' title='Image'><span class='fa fa-picture'></span><span class='sr-only'>Bild einfügen</span></a>\
                    </div>\
                               <select class='fontfamily form-control md-width' aria-label='Schrifart' title='Schriftart'>\
                                   <option value=''>--</option>\
                                   <option value='Arial'>Arial</option>\
                                   <option value='New Times Roman'>New Times Roman</option>\
                               </select>\
                    <select class='blockstyle form-control md-width' aria-label='Formatieren' title='Formatieren'>\
                        <option value=''>Block style</option>\
                        <option value='p'>Paragraph</option>\
                        <option value='h3'>Title</option>\
                        <option value='address'>Address</option>\
                    </select>\
                </div>";
                //<a href='#' class='orderedlist btn btn-default btn-flat' title='Ordered list'>Ordered List</a>&nbsp;

                // $('.blockstyle', tb).change(function () {
                //     var index = this.selectedIndex;
                //     if (index !== 0) {
                //         var selected = this.options[index].value;
                //         formatText("formatblock", '<' + selected + '>');
                //     }
                // });
                selectFont.addEventListener('change', function () {
                    var index = selectFont.selectedIndex;
                    if (index !== 0) {
                        var selected = selectFont.options[index].value;
                        formatText("formatblock", `div`);
                    }
                });
                select.addEventListener('change', function () {
                    var index = select.selectedIndex;
                    if (index === 0) {
                        formatText("removeFormat");
                    } else {
                        var selected = select.options[index].value;
                        formatText("fontname", selected);
                    }
                });

                btnBold.onclick = function () { formatText('bold'); return false; };
                btnItalic.onclick = function () { formatText('italic'); return false; };
                btnUnderline.onclick = function () { formatText('underline'); return false; };
                unorderedlist.onclick = function () { formatText('insertunorderedlist'); return false; };
                orderedlist.onclick = function () { formatText('insertorderedlist'); return false; };
                justifyRight.onclick = function () { formatText('justifyRight'); return false; };
                justifyLeft.onclick = function () { formatText('justifyLeft'); return false; };
                justifyCenter.onclick = function () { formatText('justifyCenter'); return false; };
                // justifyFull.onclick = function () { formatText('justifyFull'); return false; };
                redo.onclick = function () { formatText('redo'); return false; };
                undo.onclick = function () { formatText('undo'); return false; };
                link.onclick = function () {
                    var p = prompt("URL:");
                    if (p)
                        formatText('CreateLink', p);
                    return false;
                };
                // $('.wiki', tb).click(function () {
                //     var p = prompt("URL:");
                //     if (p) formatText('CreateLink', p);
                //     return false;
                // });
                // $('.image', tb).click(function () {
                //     var p = prompt("image URL:");
                //     if (p) formatText('InsertImage', p);
                //     return false;
                // });

                // var iframeDoc = $(fakeArea); //$(iframe.contentWindow.document);

                // var select = $('select', tb)[0];
                // iframeDoc.mouseup(function () {
                //     //setSelectedType(getSelectionElement(), select);
                //     return true;
                // });

                fakeArea.addEventListener('keyup', function (e) {
                    e.preventDefault();

                    //setSelectedType(getSelectionElement(), select);

                    const body = fakeArea; // $(iframeDoc);
                    if (opts.autoscroll === true) {
                        if (body.scrollTop() > 0) {
                            var iframe_height = parseInt(iframe.style['height']);
                            if (isNaN(iframe_height))
                                iframe_height = 0;
                            var h = Math.min(opts.max_height, iframe_height + body.scrollTop()) + 'px';
                            iframe.style['height'] = h;
                        }
                    }
                    return true;
                });
                //iframeDoc.keydown(function (e) {
                //    if (e.which === 13) {
                //        document.execCommand('insertHTML', false, '<br><br>');
                //        return false;
                //        //e.preventDefault();
                //        //pasteHtmlAtCaret('<br>');
                //        //document.selection.createRange().insertNode('<br>');
                //    }
                //    //window.event.stopPropagation();
                //});

                return toolbar;
            }


            function pasteHtmlAtCaret(html) {
                var sel, range;
                opts.enablePaste = true;
                if (window.getSelection) {
                    // IE9 and non-IE
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();
                        var frag = range.createContextualFragment(html);
                        range.insertNode(frag);
                    }
                } else if (document.selection && document.selection.type !== "Control") {
                    // IE < 9
                    document.selection.createRange().pasteHTML(html);
                }
                opts.enablePaste = false;
            }


            function formatText(command, option) {
                //iframe.contentWindow.focus();
                try {
                    //document.execCommand("styleWithCSS", true, null);
                    document.execCommand(command, false, option);
                    // $(fakeArea).focusout();
                } catch (e) {
                    console.log(e.toString());
                }
                //iframe.contentWindow.focus();
            }

            function setSelectedType(node, select) {
                while (node.parentNode) {
                    const nName = node.nodeName.toLowerCase();
                    for (let i = 0; i < select.options.length; i++) {
                        if (nName === select.options[i].value) {
                            select.selectedIndex = i;
                            return true;
                        }
                    }
                    node = node.parentNode;
                }
                select.selectedIndex = 0;
                return true;
            }

            function getSelectionElement() {
                var test = false;
                if (test && window.selection) {
                    // IE selections
                    selection = window.selection;
                    range = selection.createRange();
                    try {
                        node = range.parentElement();
                    }
                    catch (e) {
                        return false;
                    }
                } else {
                    // Mozilla selections
                    try {
                        selection = window.getSelection();
                        range = selection.getRangeAt(0);
                    }
                    catch (e) {
                        return false;
                    }
                    node = range.commonAncestorContainer;
                }
                return node;
            }

            // enable design mode now
            enableDesignMode();

        } //return this.each

    }// rte
}
