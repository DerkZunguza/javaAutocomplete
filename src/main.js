import plugin from '../plugin.json';

class AcodePlugin {
  constructor() {
    this.mappings = {
      "psvm": "public static void main(String[] args) {\n\t\n}",
      "sout": "System.out.println();",
      "syserr": "System.err.println();",
      "fori": "for (int i = 0; i < ; i++) {\n\t\n}",
      "foreach": "for (Tipo variavel : colecao) {\n\t\n}",
      "ifn": "if (obj == null) {\n\t\n}",
      "trycatch": "try {\n\t\n} catch (Exception e) {\n\te.printStackTrace();\n}",
      "while": "while (condicao) {\n\t\n}",
      "doWhile": "do {\n\t\n} while (condicao);",
      "switch": "switch (variavel) {\n\tcase valor:\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}",
      "class": "public class NomeClasse {\n\t\n}",
      "interface": "public interface NomeInterface {\n\t\n}",
      "sysoutf": "System.out.printf(\"\");"
    };
  }

  async init() {
    const editor = editorManager.editor;

    this.command = {
      name: "java-autocomplete",
      bindKey: { win: "Tab", mac: "Tab" },
      exec: (editor) => {
        let cursor = editor.getCursorPosition();
        let line = editor.session.getLine(cursor.row);
        let words = line.trim().split(" ");
        let lastWord = words[words.length - 1];

        if (this.mappings[lastWord]) {
          editor.session.replace(
            new ace.Range(cursor.row, line.lastIndexOf(lastWord), cursor.row, line.length),
            this.mappings[lastWord]
          );
        }
      },
    };

    editor.commands.addCommand(this.command);
  }

  async destroy() {
    editorManager.editor.commands.removeCommand("java-autocomplete");
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init();
  });
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}