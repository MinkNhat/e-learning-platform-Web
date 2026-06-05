import { useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Undo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  Alignment,
  List,
  Link,
  BlockQuote,
  CodeBlock,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageUpload,
  Base64UploadAdapter,
  MediaEmbed,
  HorizontalLine,
  Indent,
  IndentBlock,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "@/styles/ckeditor.scss";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CKEditorField({
  value,
  onChange,
  placeholder,
  disabled = false,
}: Props) {
  const editorRef = useRef<ClassicEditor | null>(null);

  // Sync value từ ngoài vào (dùng cho edit mode)
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.getData() !== value) {
      editor.setData(value ?? "");
    }
  }, [value]);

  return (
    <div className={`ck-editor-antd-wrapper ${disabled ? "ck-disabled" : ""}`}>
      <CKEditor
        editor={ClassicEditor}
        data={value ?? ""}
        disabled={disabled}
        config={{
          licenseKey: "GPL", // dùng miễn phí, hiện logo nhỏ
          placeholder: placeholder ?? "Enter content...",
          plugins: [
            Essentials, Paragraph, Undo,
            Bold, Italic, Underline, Strikethrough,
            Heading,
            Alignment,
            List,
            Indent, IndentBlock,
            Link,
            BlockQuote,
            CodeBlock,
            Table, TableToolbar, TableProperties, TableCellProperties,
            Image, ImageToolbar, ImageCaption, ImageStyle,
            ImageUpload, Base64UploadAdapter, // upload ảnh không cần server
            MediaEmbed,
            HorizontalLine,
          ],
          toolbar: {
            items: [
              "undo", "redo",
              "|", "heading",
              "|", "bold", "italic", "underline", "strikethrough",
              "|", "alignment",
              "|", "bulletedList", "numberedList", "outdent", "indent",
              "|", "link", "insertImage", "mediaEmbed",
              "|", "insertTable", "blockQuote", "codeBlock", "horizontalLine",
            ],
            shouldNotGroupWhenFull: true,
          },
          heading: {
            options: [
              { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
              { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
              { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
              { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
            ],
          },
          table: {
            contentToolbar: [
              "tableColumn", "tableRow", "mergeTableCells",
              "tableProperties", "tableCellProperties",
            ],
          },
          image: {
            toolbar: [
              "imageTextAlternative", "toggleImageCaption",
              "|", "imageStyle:inline", "imageStyle:block", "imageStyle:side",
            ],
          },
        }}
        onReady={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(_, editor) => {
          onChange?.(editor.getData());
        }}
      />
    </div>
  );
}