export interface MarkdownVariablesConfig {
    // Strings that start with this prefix are treated as variables
    prefix?: string,
    // Strings that start with this prefix are NOT treated as variables
    noVarPrefix?: string,
    // This function will be called to store a variable's value in persistent storage
    storeVar?: ((varName: string, varValue: string) => void),
    // This function will be called to load a variable's value from persistent storage
    loadVar?: ((varName: string) => string|null)
}

export const defaultMarkdownVariablesConfig: MarkdownVariablesConfig = {
    prefix: "$",
    noVarPrefix: "$no_md_var_",
}