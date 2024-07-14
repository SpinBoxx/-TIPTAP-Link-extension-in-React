import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		customExtension: {
			replaceSelectionWithLink: (href: string) => ReturnType;
		};
	}
}

export interface CustomExtensionOptions {
	HTMLAttributes: Record<string, any>;
}

const LinkExtensionReact = Mark.create<CustomExtensionOptions>({
	name: "LinkExtensionReact",
	addOptions() {
		return {
			awesomeness: 100,
			HTMLAttributes: {},
			onCommentActivated: () => {},
		};
	},
	addStorage() {
		return {
			awesomeness: 1000,
		};
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"span",
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
			0,
		];
	},
	addCommands() {
		return {
			replaceSelectionWithLink:
				(href: string) =>
				({ state, dispatch }) => {
					const { tr, selection } = state;
					const { from, to } = selection;
					// Get the selected text
					const text = state.doc.textBetween(from, to, " ");

					// Creating a link node with the selected text
					const linkNode = state.schema.text(text, [
						state.schema.marks.link.create({ href }),
					]);

					// Replace the selection by the link node
					tr.replaceWith(from, to, linkNode);

					// Apply the transaction
					if (dispatch) {
						dispatch(tr);
					}

					return true;
				},
		};
	},
});

export { LinkExtensionReact };

export default LinkExtensionReact;
