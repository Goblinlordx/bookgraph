import { createNode, getVisibleNodes, graphBuilder, graphViewer } from ".";

const basicGraph = () => {
  const asdfWorld = {
    id: "0",
    type: "world",
    data: {
      name: "asdf",
    },
  };

  const book1 = {
    id: "1",
    type: "book",
    data: {
      name: "book1",
    },
  };

  const book1chapter1 = {
    id: "2",
    type: "chapter",
    data: {
      name: "1",
    },
  };

  const book1chapter2 = {
    id: "3",
    type: "chapter",
    data: {
      name: "2",
    },
  };

  const char1 = {
    id: "4",
    type: "character",
    data: {
      name: "char1",
    },
  };

  const charDesc1 = {
    id: "5",
    type: "character_description",
    data: {
      description: "Tall",
    },
  };

  const char2 = {
    id: "6",
    type: "character",
    data: {
      name: "char2",
    },
  };

  const graph = graphBuilder()
    .addNodeType({
      type: "world",
      fields: [
        {
          name: "name",
          type: "text",
        },
      ],
    })
    .addNodeType({
      type: "book",
      fields: [
        {
          name: "name",
          type: "text",
        },
      ],
    })
    .addNodeType({
      type: "chapter",
      fields: [
        {
          name: "name",
          type: "text",
        },
      ],
    })
    .addNodeType({
      type: "character",
      fields: [
        {
          name: "name",
          type: "text",
        },
      ],
    })
    .addNodeType({
      type: "character_description",
      fields: [
        {
          name: "description",
          type: "text",
        },
      ],
    })
    .addConnectionType(["world", "book"])
    .addConnectionType(["book", "chapter"])
    .addConnectionType(["chapter", "character"])
    .addConnectionType(["chapter", "character_description"])
    .addConnectionType(["character", "character_description"])
    .addNode(asdfWorld)
    .addNode(book1)
    .addNode(book1chapter1)
    .addNode(book1chapter2)
    .addNode(char1)
    .addNode(char2)
    .addNode(charDesc1)
    .addConnection([asdfWorld.id, book1.id])
    .addConnection([book1.id, book1chapter1.id])
    .addConnection([book1.id, book1chapter2.id])
    .addConnection([book1chapter1.id, char1.id])
    .addConnection([book1chapter2.id, char2.id])
    .addConnection([book1chapter1.id, charDesc1.id])
    .addConnection([char1.id, charDesc1.id])
    .build();

  return graph;
};

describe("graphBuilder", () => {
  it("creates graph", () => {
    const graph = graphBuilder().build();
    expect(graph).toBeTruthy();
  });

  it("can add node type", () => {
    const graph = graphBuilder()
      .addNodeType({
        type: "world",
        fields: [
          {
            name: "name",
            type: "text",
          },
        ],
      })
      .build();

    expect(graph.nodeSchema.length).toEqual(1);
  });

  it("can add new node", () => {
    const graph = graphBuilder()
      .addNodeType({
        type: "world",
        fields: [
          {
            name: "name",
            type: "text",
          },
        ],
      })
      .addNode(
        createNode({
          type: "world",
          data: {},
        })
      )
      .build();

    expect(graph.nodes.length).toEqual(1);
  });

  it("can add new connection type", () => {
    const graph = graphBuilder()
      .addNodeType({
        type: "world",
        fields: [
          {
            name: "name",
            type: "text",
          },
        ],
      })
      .addNodeType({
        type: "book",
        fields: [
          {
            name: "name",
            type: "text",
          },
        ],
      })
      .addConnectionType(["world", "book"])
      .build();

    expect(graph.graphSchema.connections.length).toEqual(1);
  });

  it("can add new connection", () => {
    const asdfWorld = {
      id: "0",
      type: "world",
      data: {
        name: "asdf",
      },
    };

    const book1 = {
      id: "1",
      type: "book",
      data: {
        name: "book1",
      },
    };

    const graph = graphBuilder()
      .addNodeType({
        type: "world",
        fields: [
          {
            name: "name",
            type: "text",
          },
        ],
      })
      .addNodeType({
        type: "book",
        fields: [
          {
            name: "name",
            type: "text",
          },
        ],
      })
      .addConnectionType(["world", "book"])
      .addNode(asdfWorld)
      .addNode(book1)
      .addConnection([asdfWorld.id, book1.id])
      .build();

    expect(graph.adjacencyList["0"]).toEqual(["1"]);
  });

  it("can add new connection", () => {
    const asdfWorld = {
      id: "0",
      type: "world",
      data: {
        name: "asdf",
      },
    };

    const book1 = {
      id: "1",
      type: "book",
      data: {
        name: "book1",
      },
    };

    const book1chapter1 = {
      id: "2",
      type: "chapter",
      data: {
        name: "1",
      },
    };

    const book1chapter2 = {
      id: "3",
      type: "chapter",
      data: {
        name: "1",
      },
    };

    const char1 = {
      id: "4",
      type: "character",
      data: {
        name: "char1",
      },
    };

    const char2 = {
      id: "5",
      type: "character",
      data: {
        name: "char2",
      },
    };

    const graph = graphBuilder()
      .addNodeType({
        type: "world",
        fields: [
          {
            name: "name",
            type: "text",
          },
        ],
      })
      .addNodeType({
        type: "book",
        fields: [
          {
            name: "name",
            type: "text",
          },
        ],
      })
      .addNodeType({
        type: "chapter",
        fields: [
          {
            name: "name",
            type: "text",
          },
        ],
      })
      .addNodeType({
        type: "character",
        fields: [
          {
            name: "name",
            type: "text",
          },
        ],
      })
      .addConnectionType(["world", "book"])
      .addConnectionType(["book", "chapter"])
      .addConnectionType(["chapter", "character"])
      .addNode(asdfWorld)
      .addNode(book1)
      .addNode(book1chapter1)
      .addNode(book1chapter2)
      .addNode(char1)
      .addNode(char2)
      .addConnection([asdfWorld.id, book1.id])
      .addConnection([book1.id, book1chapter1.id])
      .addConnection([book1.id, book1chapter2.id])
      .addConnection([book1.id, book1chapter2.id])
      .addConnection([book1chapter1.id, char1.id])
      .addConnection([book1chapter2.id, char2.id])
      .build();

    const visible = getVisibleNodes(graph)(["0", "1", "2"]);

    expect(visible).toMatchInlineSnapshot(`
Array [
  "0",
  "1",
  "2",
  "3",
  "4",
]
`);
  });

  it("will error when adding invalid connection", () => {
    const t = () => graphBuilder(basicGraph()).addConnection(["5", "0"]);

    expect(t).toThrowError(
      "invalid connection type: world -> character_description"
    );
  });
});

describe("graphViewer", () => {
  it("can reveal nodes", () => {
    const viewer = graphViewer(basicGraph());
    const nodes = viewer.revealNodes(["0"]).getNodes();

    expect(nodes.length).toEqual(2);

    const nodes2 = viewer.revealNodes(["0", "1"]).getNodes();

    expect(nodes2.length).toEqual(4);
  });

  it("can hide nodes", () => {
    const viewer = graphViewer(basicGraph());
    const nodes = viewer.revealNodes(["0"]).hideNodes(["1"]).getNodes();

    expect(nodes.length).toEqual(2);
  });

  it("can get visible children nodes", () => {
    const viewer = graphViewer(basicGraph());
    const nodes = viewer.revealNodes(["0", "1"]).getChildren("1");

    expect(nodes.length).toEqual(2);
  });

  it("can get by type", () => {
    const viewer = graphViewer(basicGraph());
    const nodes = viewer.revealNodes(["0", "1"]).getByType("chapter");

    expect(nodes.length).toEqual(2);
    expect(nodes.every((n) => n.type === "chapter")).toBeTruthy();
  });

  it("can get children by type", () => {
    const viewer = graphViewer(basicGraph());
    const nodes = viewer
      .revealNodes(["0", "1", "2"])
      .getChildrenByType("2", "character");

    expect(nodes.length).toEqual(1);
    expect(nodes[0]?.id).toEqual("4");
  });

  it("can store and restore state", () => {
    const graph = basicGraph();

    const stored = graphViewer(graph).revealNodes(["0", "1"]).state();
    const restored = graphViewer(graph, stored).getNodes();

    expect(restored.length).toEqual(4);
  });

  it("getNodeById: can retrieve invisible node", () => {
    const graph = basicGraph();

    const invisibleNode = graphViewer(graph)
      .revealNodes(["0", "1"])
      .getNodeById("5");

    expect(invisibleNode?.id).toEqual("5");
  });

  it("getVNodeById: can not retrieve invisible node", () => {
    const graph = basicGraph();

    const invisibleNode = graphViewer(graph)
      .revealNodes(["0", "1"])
      .getVNodeById("5");

    expect(invisibleNode).toEqual(undefined);
  });
});
