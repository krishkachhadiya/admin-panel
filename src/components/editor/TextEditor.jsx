"use client";

import dynamic from "next/dynamic";

import {
  useMemo,
} from "react";

const JoditEditor =
  dynamic(
    () =>
      import("jodit-react"),
    {
      ssr: false,
    }
  );

export default function TextEditor({

  value = "",

  onChange,

  height = 400,

}) {

  const config =
  useMemo(
    () => ({

      readonly: false,

      height,

      buttons: [

        "bold",

        "italic",

        "underline",

        "|",

        "ul",

        "ol",

        "|",

        "link",

        "image",

        "|",

        "undo",

        "redo",

      ],

      removeButtons:
        ["source"],

      showXPath:
        false,

      showCharsCounter:
        false,

      showWordsCounter:
        false,

      toolbarAdaptive:
        false,

    }),
    [height]
  );




  return (

    <JoditEditor
      value={value}

      config={config}

      onBlur={onChange}
    />

  );
}