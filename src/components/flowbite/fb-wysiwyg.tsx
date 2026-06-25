"use client";

import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor, } from "@tiptap/react";
import { useEffect, type ReactElement, } from "react";

import {
    fbWysiwygEditor,
    fbWysiwygToolbar,
    fbWysiwygToolbarButton,
    fbWysiwygToolbarButtonActive,
    fbWysiwygWrap,
} from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

export type FbWysiwygProps = {
    value?: string;
    onChange?: (value: string) => void;
    editable?: boolean;
    className?: string;
};

function toolbarClass (isActive: boolean): string {
    return cn (
        fbWysiwygToolbarButton,
        isActive && fbWysiwygToolbarButtonActive
    );
}

const FbWysiwyg = ({
    value = "",
    onChange,
    editable = true,
    className,
}: FbWysiwygProps): ReactElement => {
    const editor = useEditor ({
        extensions: [StarterKit],
        content: value,
        editable,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: fbWysiwygEditor,
            },
        },
        onUpdate: ({ editor: activeEditor, }) => {
            onChange?.(activeEditor.getHTML ());
        },
    });

    useEffect((): void => {
        if (! editor) {
            return;
        }

        if (value !== editor.getHTML ()) {
            editor.commands.setContent (value ?? "", false);
        }
    }, [ editor, value, ]);

    useEffect((): void => {
        editor?.setEditable (editable);
    }, [ editor, editable, ]);

    return (
        <div className={cn (fbWysiwygWrap, className)}>
            {editor ? (
                <div className={fbWysiwygToolbar}>
                    <button
                        type="button"
                        className={toolbarClass (editor.isActive ("bold"))}
                        disabled={! editable}
                        onClick={(): void => {
                            editor.chain ().focus ().toggleBold ().run ();
                        }}
                    >
                        <span className="sr-only">Bold</span>
                        <span className="text-sm font-bold">B</span>
                    </button>
                    <button
                        type="button"
                        className={toolbarClass (editor.isActive ("italic"))}
                        disabled={! editable}
                        onClick={(): void => {
                            editor.chain ().focus ().toggleItalic ().run ();
                        }}
                    >
                        <span className="sr-only">Italic</span>
                        <span className="text-sm italic">I</span>
                    </button>
                    <button
                        type="button"
                        className={toolbarClass (editor.isActive ("heading", { level: 2 }))}
                        disabled={! editable}
                        onClick={(): void => {
                            editor.chain ().focus ().toggleHeading ({ level: 2 }).run ();
                        }}
                    >
                        <span className="sr-only">Heading</span>
                        <span className="text-sm font-semibold">H2</span>
                    </button>
                    <button
                        type="button"
                        className={toolbarClass (editor.isActive ("bulletList"))}
                        disabled={! editable}
                        onClick={(): void => {
                            editor.chain ().focus ().toggleBulletList ().run ();
                        }}
                    >
                        <span className="sr-only">Bullet list</span>
                        <span className="text-sm">• List</span>
                    </button>
                    <button
                        type="button"
                        className={toolbarClass (editor.isActive ("orderedList"))}
                        disabled={! editable}
                        onClick={(): void => {
                            editor.chain ().focus ().toggleOrderedList ().run ();
                        }}
                    >
                        <span className="sr-only">Ordered list</span>
                        <span className="text-sm">1. List</span>
                    </button>
                    <button
                        type="button"
                        className={toolbarClass (editor.isActive ("blockquote"))}
                        disabled={! editable}
                        onClick={(): void => {
                            editor.chain ().focus ().toggleBlockquote ().run ();
                        }}
                    >
                        <span className="sr-only">Blockquote</span>
                        <span className="text-sm">“”</span>
                    </button>
                    <button
                        type="button"
                        className={fbWysiwygToolbarButton}
                        disabled={! editable || ! editor.can ().chain ().focus ().undo ().run ()}
                        onClick={(): void => {
                            editor.chain ().focus ().undo ().run ();
                        }}
                    >
                        <span className="sr-only">Undo</span>
                        <span className="text-sm">Undo</span>
                    </button>
                    <button
                        type="button"
                        className={fbWysiwygToolbarButton}
                        disabled={! editable || ! editor.can ().chain ().focus ().redo ().run ()}
                        onClick={(): void => {
                            editor.chain ().focus ().redo ().run ();
                        }}
                    >
                        <span className="sr-only">Redo</span>
                        <span className="text-sm">Redo</span>
                    </button>
                </div>
            ) : null}
            <EditorContent editor={editor} />
        </div>
    );
};

export default FbWysiwyg;
