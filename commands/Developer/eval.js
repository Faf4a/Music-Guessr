module.exports = [{
    name: "eval",
    data: {
        category: "dev",
        type: "exclude"
    },
    code: `
\`\`\`php
$eval[$message;true;true;true;true]
\`\`\`
$onlyIf[$authorId==$clientOwnerIds]`
}, {
    name: "djseval",
    data: {
        category: "dev",
        type: "exclude"
    },
    code: `
\`\`\`php
$djsEval[$message;true]
\`\`\`
$onlyIf[$authorId==$clientOwnerIds]`
}]