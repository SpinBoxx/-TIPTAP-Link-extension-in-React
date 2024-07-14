import type { SingleCommands } from "@tiptap/core";
import type { EditorState, Selection, Transaction } from "@tiptap/pm/state";

interface DeleteContentByRangeParams {
	from: number;
	to: number;
	editorState: EditorState;
	dispatch?: (tr: Transaction) => void;
}

/**
 * Delete the content between 2 boundaries. Delete also the node
 * @param {number} from number
 * @param {number} to number
 * @param {any} editorState EditorState
 * @param {any} dispatch () => void

 * @returns {void} void
 */
export const deleteContentByRange = ({
	from,
	to,
	editorState,
	dispatch,
}: DeleteContentByRangeParams): void => {
	const { tr: transaction } = editorState;

	transaction.deleteRange(from, to);
	if (dispatch) {
		dispatch(transaction);
	}
};

/**
 * Return false if there is any selected text in the editor, otherwise return true
 * @param selection:Selection
 * @returns {boolean}
 */
export const isTextSelected = (selection: Selection): boolean => {
	const { empty } = selection;
	return empty;
};

interface ReplaceContentParams {
	selection: Selection;
	contentToReplace: string;
	dispatch: ((args?: any) => any) | undefined;
	editorState: EditorState;
	commands: SingleCommands;
}

export const replaceContent = ({
	selection,
	contentToReplace,
	editorState,
	dispatch,
	commands,
}: ReplaceContentParams) => {
	const { from, to } = selection;
	deleteContentByRange({ from, to, editorState, dispatch });
	commands.insertContentAt(from, `${contentToReplace}`);
};

interface GetHrefFromLinkMarkInRangeProps {
	editorState: EditorState;
	selection: Selection;
}

export const getHrefFromLinkMarkInRange = ({
	editorState,
	selection,
}: GetHrefFromLinkMarkInRangeProps): string => {
	const { from, to } = selection;
	const linkMark = editorState.schema.marks.link;
	const marks = editorState.doc.rangeHasMark(from, to, linkMark);
	console.log({ marks });

	if (marks) {
		const node = editorState.doc.nodeAt(from);

		if (node?.marks) {
			const link = node.marks.find((mark) => mark.type === linkMark);
			if (link) {
				return link.attrs.href;
			}
		}
	}
	return "";
};
