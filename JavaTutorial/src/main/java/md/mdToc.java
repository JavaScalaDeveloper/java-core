package md;

import com.github.houbb.markdown.toc.core.impl.AtxMarkdownToc;

public class mdToc {
    public static void main(String[] args) {
        String path = "D:\\idea_project\\JavaTutorial\\docs\\java-web\\temp";
        AtxMarkdownToc.newInstance().genTocDir(path);
    }
}
