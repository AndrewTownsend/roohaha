import React from "react";

import tinymce from 'tinymce/tinymce.min.js';

window.tinymce = tinymce;

import { Editor } from '@tinymce/tinymce-react';

import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/icons/default/icons.min.js';
// import 'tinymce/plugins/paste/plugin.min.js';
import 'tinymce/plugins/link/plugin.min.js';
import 'tinymce/plugins/lists/plugin.min.js';
import 'tinymce/plugins/advlist/plugin.min.js';
import 'tinymce/plugins/anchor/plugin.min.js';
import 'tinymce/plugins/autolink/plugin.min.js';
import 'tinymce/plugins/charmap/plugin.min.js';
import 'tinymce/plugins/code/plugin.min.js';
import 'tinymce/plugins/codesample/plugin.min.js';
// import 'tinymce/plugins/colorpicker/plugin.min.js';
import 'tinymce/plugins/table/plugin.min.js';
import 'tinymce/plugins/wordcount/plugin.min.js';
// import 'tinymce/plugins/textcolor/plugin.min.js';
import 'tinymce/plugins/image/plugin.min.js';
// import 'tinymce/plugins/imagetools/plugin.min.js';
// import 'tinymce/plugins/contextmenu/plugin.min.js';
// import contentCss from 'tinymce/skins/content/default/content.min.css?raw';
// import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css?raw';

export const TinyMceEditor = (props) => {
    return (
        <Editor
            {...props}
            init={{
                skin: false,
                content_css: false,
                menubar: false,
                toolbar: 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright ' +
                    'alignjustify | outdent indent |  numlist bullist checklist link | forecolor backcolor casechange ' +
                    'removeformat | charmap | fullscreen | fontselect fontsizeselect formatselect',
                plugins: [
                    'paste link lists advlist anchor autolink charmap code codesample ' +
                    'table wordcount'
                ],
                // content_style: [contentCss.toString(), contentUiCss.toString()].join(''),
                content_style: [].join(''),
            }}
        />);
};