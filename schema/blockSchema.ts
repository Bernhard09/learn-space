import { BlockNoteSchema, 
    defaultBlockSchema, 
    defaultBlockSpecs, 
    defaultInlineContentSpecs, 
    defaultStyleSpecs, 
    defaultProps,
    DefaultProps,
    
} from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";



// export const customBlockSpecs = Object.fromEntries(
//         Object.entries(defaultBlockSpecs).map(([blockName, blockSpec]) => [
//         blockName,
//         {
//             ...blockSpec,
//             config: {
//             ...blockSpec.config,
//             propSchema: {
//                 ...blockSpec.config.propSchema,
//                 hideWhenShared: {
//                 default: false,
//                 },
//             },
//             },
//         },
//     ])
// );


// const customSchema = BlockNoteSchema.create(customBlockSpecs);

// const customBlockSpecs = Object.fromEntries(
//     Object.entries(defaultBlockSpecs).map(([blockType, blockSpec]) => {
//       return [
//         blockType,
//         {
//           ...blockSpec,
//           config: {
//             ...blockSpec.config,
//             propSchema: {
//               ...blockSpec.config.propSchema,
//               hideWhenShared: {
//                 default: false,
//               },
//             },
//           },
//         },
//       ];
//     })
//   );



// export const extendedBlockSchema = {
//   ...defaultBlockSchema, 
//   paragraph: {
//     ...defaultBlockSchema.paragraph,
//     propSchema: {
//       ...defaultBlockSchema.paragraph.propSchema, 
//       hideWhenShared: {default: false},
//     }
//   }
// }

// export const customSchema = BlockNoteSchema.create({
//   blockSpecs: {
//     ...defaultBlockSpecs,
//     paragraph: {
//       ...defaultBlockSpecs.paragraph,
//       propSchema: {
//         ...defaultBlockSpecs.paragraph.config.propSchema,
//         hideWhenShared: {
//           default: false,
//         }  
//       },
//     }
//   },
//   inlineContentSpecs: {
//     ...defaultInlineContentSpecs
//   },
//   styleSpecs: {
//     ...defaultStyleSpecs,
//   }
// });

// const customProps = {
//   ...defaultProps,
//   hideShare: {
//     default: false,
//   }
// }


// const lsParagraph = createReactBlockSpec(
//   {
//     type: "paragraph",
//     propSchema: {
//         ...defaultBlockSpecs.paragraph.config.propSchema,
//         hideWhenShared: {
//           default: false,
//         },  
//     },
//     content: "inline",
//   },   
//   {
//     render: (props) => {

//     }
//   } 
// );


// export const mySchema = BlockNoteSchema.create({
//   blockSpecs: {
//     ...defaultBlockSpecs,
//     paragraph: {
//       ...defaultBlockSpecs.paragraph,
//       config: {
//         ...defaultBlockSpecs.paragraph.config,
//         propSchema: {
//           ...defaultBlockSpecs.paragraph.config.propSchema,
//           hideWhenShared: {
//             default: "false",
//             value: ["false", "true"],
//         }  
//         }
//       },
//       propSchema: {
//         ...defaultBlockSpecs.paragraph.config.propSchema,
//         hideWhenShared: {
//           default: "false",
//           value: ["false","true"],
//         }  
//       },
//     }
//   },
// });

const paragraphWithPresentation = {
  // Start with all the default paragraph properties
  ...defaultBlockSpecs.paragraph,
  // Add our custom property to the props
  props: {
    ...defaultBlockSpecs.paragraph.config.propSchema, // Keep the existing props like textColor
    isInPresentation: {
      type: "boolean",
      default: false,
    },
  },
};

export const presentationSchema = BlockNoteSchema.create({
  blockSpecs: {
    // Start with all the default blocks
    ...defaultBlockSpecs,
    // Now, OVERRIDE the ones you want to customize
    paragraph: paragraphWithPresentation,
    // heading: headingWithPresentation,
    // Add any other blocks you customized, e.g., bulletListItem
  },
});

// Type helper for the editor
export type PresentationEditor = typeof presentationSchema.BlockNoteEditor;
