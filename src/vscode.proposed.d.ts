declare module 'vscode' {
	//#region --- Type hierarchy --- @eskibear
	export class TypeHierarchyItem {
		/**
		 * The name of this item.
		 */
		name: string;
		/**
		 * The kind of this item.
		 */
		kind: SymbolKind;
		/**
		 * Tags for this item.
		 */
		tags?: ReadonlyArray<SymbolTag>;
		/**
		 * More detail for this item, e.g. the signature of a function.
		 */
		detail?: string;
		/**
		 * The resource identifier of this item.
		 */
		uri: Uri;
		/**
		 * The range enclosing this symbol not including leading/trailing whitespace
		 * but everything else, e.g. comments and code.
		 */
		range: Range;
		/**
		 * The range that should be selected and revealed when this symbol is being
		 * picked, e.g. the name of a function. Must be contained by the
		 * [`range`](#TypeHierarchyItem.range).
		 */
		selectionRange: Range;
		/**
		 * A data entry field that is preserved between a type hierarchy prepare and
		 * supertypes or subtypes requests. It could also be used to identify the
		 * type hierarchy in the server, helping improve the performance on
		 * resolving supertypes and subtypes.
		 */
		data?: unknown;

		constructor(kind: SymbolKind, name: string, detail: string, uri: Uri, range: Range, selectionRange: Range);
	}

	export interface TypeHierarchyProvider {

		/**
		 * Bootstraps type hierarchy by returning the item that is denoted by the given document
		 * and position. This item will be used as entry into the type graph. Providers should
		 * return `undefined` or `null` when there is no item at the given location.
		 *
		 * @param document The document in which the command was invoked.
		 * @param position The position at which the command was invoked.
		 * @param token A cancellation token.
		 * @returns A type hierarchy item or a thenable that resolves to such. The lack of a result can be
		 * signaled by returning `undefined` or `null`.
		 */
		prepareTypeHierarchy(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<TypeHierarchyItem[]>;

		/**
		 * Provide all supertypes for an item, e.g all types from which a type is derived/inherited. In graph terms this describes directed
		 * and annotated edges inside the type graph, e.g the given item is the starting node and the result is the nodes
		 * that can be reached.
		 *
		 * @param item The hierarchy item for which super types should be computed.
		 * @param token A cancellation token.
		 * @returns A set of supertypes or a thenable that resolves to such. The lack of a result can be
		 * signaled by returning `undefined` or `null`.
		 */
		provideTypeHierarchySupertypes(item: TypeHierarchyItem, token: CancellationToken): ProviderResult<TypeHierarchyItem[]>;

		/**
		 * Provide all subtypes for an item, e.g all types which are derived/inherited from the given item. In
		 * graph terms this describes directed and annotated edges inside the type graph, e.g the given item is the starting
		 * node and the result is the nodes that can be reached.
		 *
		 * @param item The hierarchy item for which subtypes should be computed.
		 * @param token A cancellation token.
		 * @returns A set of subtypes or a thenable that resolves to such. The lack of a result can be
		 * signaled by returning `undefined` or `null`.
		 */
		provideTypeHierarchySubtypes(item: TypeHierarchyItem, token: CancellationToken): ProviderResult<TypeHierarchyItem[]>;
	}

	export namespace languages {
		/**
		 * Register a type hierarchy provider.
		 *
		 * @param selector A selector that defines the documents this provider is applicable to.
		 * @param provider A type hierarchy provider.
		 * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
		 */
		export function registerTypeHierarchyProvider(selector: DocumentSelector, provider: TypeHierarchyProvider): Disposable;
	}
	//#endregion
}