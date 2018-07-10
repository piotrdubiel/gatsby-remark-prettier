const remark = require("remark")
const plugin = require("../index")

describe("remark prettier plugin", () => {
  describe("javascript", () => {
    it("should format prettier hello world example", async () => {
      const code = `
\`\`\`javascript
function HelloWorld({greeting = "hello", greeted = '"World"', silent = false, onMouseOver,}) {
  
    if(!greeting){return null};
  
        // TODO: Don't use random in render
    let num = Math.floor (Math.random() * 1E+7).toString().replace(/\\.\\d+/ig, "")
  
    return <div className='HelloWorld' title={\`You are visitor number \${ num }\`} onMouseOver={onMouseOver}>
  
      <strong>{ greeting.slice( 0, 1 ).toUpperCase() + greeting.slice(1).toLowerCase() }</strong>
      {greeting.endsWith(",") ? " " : <span style={{color: '\\grey'}}>", "</span> }
      <em>
    { greeted }
    </em>
      { (silent)
        ? "."
        : "!"}
  
      </div>;
  
  }
  \`\`\`
  `

      const expected = `function HelloWorld({
  greeting = "hello",
  greeted = '"World"',
  silent = false,
  onMouseOver
}) {
  if (!greeting) {
    return null;
  }

  // TODO: Don't use random in render
  let num = Math.floor(Math.random() * 1e7)
    .toString()
    .replace(/\\.\\d+/gi, "");

  return (
    <div
      className="HelloWorld"
      title={\`You are visitor number \${num}\`}
      onMouseOver={onMouseOver}
    >
      <strong>
        {greeting.slice(0, 1).toUpperCase() + greeting.slice(1).toLowerCase()}
      </strong>
      {greeting.endsWith(",") ? (
        " "
      ) : (
        <span style={{ color: "grey" }}>", "</span>
      )}
      <em>{greeted}</em>
      {silent ? "." : "!"}
    </div>
  );
}
`

      expect.assertions(1)
      const markdownAST = remark.parse(code)
      await plugin({ markdownAST }, { usePrettierrc: false })
      expect(markdownAST.children[0].value).toEqual(expected)
    })

    it("formats javascript code blocks with default prettier options", async () => {
      const code = `
\`\`\`javascript
const x = {someLongPropertyThatWillCaseLineWrap: 1, anotherLongPropertyThatWillDefinitelyWrap: 2};
const y = 'asd'
const z = {a: 1}
const Component = () => <div className="someClass" onClick={() => {}} madeUpPropToCauseWrap andAnotherIfItsNotEnough>
    <span>Some text</span>
</div>
\`\`\`
`

      const expected = `const x = {
  someLongPropertyThatWillCaseLineWrap: 1,
  anotherLongPropertyThatWillDefinitelyWrap: 2
};
const y = "asd";
const z = { a: 1 };
const Component = () => (
  <div
    className="someClass"
    onClick={() => {}}
    madeUpPropToCauseWrap
    andAnotherIfItsNotEnough
  >
    <span>Some text</span>
  </div>
);
`

      expect.assertions(1)
      const markdownAST = remark.parse(code)
      await plugin({ markdownAST }, { usePrettierrc: false })
      expect(markdownAST.children[0].value).toEqual(expected)
    })

    it("formats javascript code blocks with .prettierrc options", async () => {
      const code = `
\`\`\`javascript
const x = {someLongPropertyThatWillCaseLineWrap: 1, anotherLongPropertyThatWillDefinitelyWrap: 2};
const y = 'asd'
const z = {a: 1}
const Component = () => <div className="someClass" onClick={() => {}} madeUpPropToCauseWrap andAnotherIfItsNotEnough>
    <span>Some text</span>
</div>
\`\`\`
`

      const expected = `const x = {
  someLongPropertyThatWillCaseLineWrap: 1,
  anotherLongPropertyThatWillDefinitelyWrap: 2,
}
const y = "asd"
const z = { a: 1 }
const Component = () => (
  <div
    className="someClass"
    onClick={() => {}}
    madeUpPropToCauseWrap
    andAnotherIfItsNotEnough>
    <span>Some text</span>
  </div>
)
`

      expect.assertions(1)
      const markdownAST = remark.parse(code)
      await plugin({ markdownAST })
      expect(markdownAST.children[0].value).toEqual(expected)
    })

    it("formats javascript code blocks with custom options", async () => {
      const code = `
\`\`\`javascript
const x = {someLongPropertyThatWillCaseLineWrap: 1, anotherLongPropertyThatWillDefinitelyWrap: 2};
const y = 'asd'
const z = {a: 1}
const Component = () => <div className="someClass" onClick={() => {}} madeUpPropToCauseWrap andAnotherIfItsNotEnough>
    <span>Some text</span>
</div>
\`\`\`
`

      const expected = `const x = {
  someLongPropertyThatWillCaseLineWrap: 1,
  anotherLongPropertyThatWillDefinitelyWrap: 2,
}
const y = 'asd'
const z = {a: 1}
const Component = () => (
  <div
    className="someClass"
    onClick={() => {}}
    madeUpPropToCauseWrap
    andAnotherIfItsNotEnough>
    <span>Some text</span>
  </div>
)
`

      expect.assertions(1)
      const markdownAST = remark.parse(code)
      await plugin(
        { markdownAST },
        {
          prettierOptions: {
            bracketSpacing: false,
            singleQuote: true,
          },
        }
      )
      expect(markdownAST.children[0].value).toEqual(expected)
    })

    it("should handle mislabled blocks", async () => {
      const code = `public void setImageURL(final String path) {
  imageCache.get(path, new OnCacheResultListener() {
    public void onCacheHit(final String key, final Bitmap bitmap) {
      setBitmap(key, bitmap);
    }
  }
}`

      const example = `
\`\`\`javascript
${code}
\`\`\`
`

      expect.assertions(1)
      const markdownAST = remark.parse(example)
      await plugin({ markdownAST })
      expect(markdownAST.children[0].value).toEqual(code)
    })
  })

  describe("typescript", () => {
    it("formats typescript code blocks", async () => {
      const code = `
\`\`\`typescript
import * as React from 'react';

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

function Hello({ name, enthusiasmLevel = 1 }: Props) {
  if (enthusiasmLevel <= 0) {
    throw new Error('You could be a little more enthusiastic. :D');
  }

  return (
    <div className="hello">
      <div className="greeting">
        Hello {name + getExclamationMarks(enthusiasmLevel)}
      </div>
    </div>
  );
}

export default Hello;

// helpers

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!');
}
\`\`\`
`

      const expected = `import * as React from "react";

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

function Hello({ name, enthusiasmLevel = 1 }: Props) {
  if (enthusiasmLevel <= 0) {
    throw new Error("You could be a little more enthusiastic. :D");
  }

  return (
    <div className="hello">
      <div className="greeting">
        Hello {name + getExclamationMarks(enthusiasmLevel)}
      </div>
    </div>
  );
}

export default Hello;

// helpers

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join("!");
}
`

      expect.assertions(1)
      const markdownAST = remark.parse(code)
      await plugin({ markdownAST }, { usePrettierrc: false })
      expect(markdownAST.children[0].value).toEqual(expected)
    })
  })
  
  describe("flow", () => {
    it("formats flow code blocks", async () => {
      const code = `
\`\`\`flow
type T = {| foo: string, bar: number |}

function foo(x: ?T): string {
  if (x) {
    return x
  }
  return "default string"
}
\`\`\`
`

      const expected = `type T = {| foo: string, bar: number |};

function foo(x: ?T): string {
  if (x) {
    return x;
  }
  return "default string";
}
`

      expect.assertions(1)
      const markdownAST = remark.parse(code)
      await plugin({ markdownAST }, { usePrettierrc: false })
      expect(markdownAST.children[0].value).toEqual(expected)
    })
  })
  
  describe("css", () => {
    it("formats css code blocks", async () => {
      const code = `
\`\`\`css
.some-class {position: absolute; top:0; left:0; right:0; bottom:0}
\`\`\`
`

      const expected = `.some-class {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
`

      expect.assertions(1)
      const markdownAST = remark.parse(code)
      await plugin({ markdownAST }, { usePrettierrc: false })
      expect(markdownAST.children[0].value).toEqual(expected)
    })
  })

  describe("scss", () => {
    it("formats scss code blocks", async () => {
      const code = `
\`\`\`scss
$val: 0;
.some-class { > div{position: absolute; top:$val; left:$val; right:$val; bottom:$val}}
\`\`\`
`

      const expected = `$val: 0;
.some-class {
  > div {
    position: absolute;
    top: $val;
    left: $val;
    right: $val;
    bottom: $val;
  }
}
`

      expect.assertions(1)
      const markdownAST = remark.parse(code)
      await plugin({ markdownAST }, { usePrettierrc: false })
      expect(markdownAST.children[0].value).toEqual(expected)
    })
  })

  describe("other languages", () => {
    it("should leave code blocks without language", async () => {
      const code = `const x = {someLongPropertyThatWillCaseLineWrap: 1, anotherLongPropertyThatWillDefinitelyWrap: 2};
const y = 'asd'
const z = {a: 1}
const Component = () => <div className="someClass" onClick={() => {}} madeUpPropToCauseWrap andAnotherIfItsNotEnough>
    <span>Some text</span>
</div>`

      const example = `
\`\`\`
${code}
\`\`\`
`

      expect.assertions(1)
      const markdownAST = remark.parse(example)
      await plugin({ markdownAST })
      expect(markdownAST.children[0].value).toEqual(code)
    })

    it("should leave other languages", async () => {
      const code = `type schoolPerson = Teacher | Director | Student(string);

let greeting = stranger =>
  switch (stranger) {
  | Teacher => "Hey professor!"
  | Director => "Hello director."
  | Student("Richard") => "Still here Ricky?"
  | Student(anyOtherName) => "Hey, " ++ anyOtherName ++ "."
  };`
      const example = `\`\`\`reason
${code}
\`\`\`
`
      expect.assertions(1)
      const markdownAST = remark.parse(example)
      await plugin({ markdownAST })
      expect(markdownAST.children[0].value).toEqual(code)
    })
  })
})
