/**
 * Created by ena3 on 8/29/18.
 */
export class Columns{


  public static  dataTypeColumns =[
    {field : "name", style:"name-col", header: "Name", position:1 },
    {field : "usage",style:"usage-col", header: "Usage", position:2 },
    {field : "length",style:"length-col", header: "Length", position:4 },
    {field : "confLength",style:"conf-col", header: "Conf.Length", position:5},
    {field : "datatype",style:"dt-col", header: "Data Type", position:6 },
    {field : "valueSet",style:"vs-col", header: "Value Set", position:7 },
    {field : "singleCode",style:"single-code-col", header: "Single Code", position:8},
    {field : "constantValue",style:"const-value-col", header: "Constant Value", position:9},
    {field : "predicate",style:"pred-col", header: "Predicate", position:10},
    {field : "textDef", style:"text-col",header: "Text Definition", position:11 },
    {field : "comment",style:"comment-col", header: "Comments", position:12}

  ];

  public static  dataTypeLibraryColumns =[
    {field : "name", style:"name-col", header: "Name", position:1 },
    {field : "usage",style:"usage-col", header: "Usage", position:2 },
    {field : "length",style:"length-col", header: "Length", position:4 },
    {field : "confLength",style:"conf-col", header: "Conf.Length", position:5},
    {field : "datatype",style:"dt-col", header: "Data Type", position:6 },
    {field : "constantValue",style:"const-value-col", header: "Constant Value", position:7},
    {field : "predicate",style:"pred-col", header: "Predicate", position:8},
    {field : "textDef", style:"text-col",header: "Text Definition", position:9 },
    {field : "comment",style:"comment-col", header: "Comments", position:10}

  ];


  public static  segmentColumns =[
    {field : "name", style:"name-col", header: "Name", position:1 },
    {field : "usage",style:"usage-col", header: "Usage", position:2 },
    {field : "cardinality",style:"card-col", header: "Cardinality", position:3},
    {field : "length",style:"length-col", header: "Length", position:4 },
    {field : "confLength",style:"conf-col", header: "Conf.Length", position:5},
    {field : "datatype",style:"dt-col", header: "Data Type", position:6 },
    {field : "valueSet",style:"vs-col", header: "Value Set", position:7 },
    {field : "singleCode",style:"single-code-col", header: "Single Code", position:8},
    {field : "constantValue",style:"const-value-col", header: "Constant Value", position:9},
    {field : "predicate",style:"pred-col", header: "Predicate", position:10},
    {field : "textDef", style:"text-col",header: "Text Definition", position:11},
    {field : "comment",style:"comment-col", header: "Comments", position:12}
  ];

  public static  messageColumns =[

    {field : "name", style:"name-col", header: "Name", position:1 },
    {field : "segment", style:"segment-col", header: "Segment", position:2 },
    {field : "usage",style:"usage-col", header: "Usage", position:3 },
    {field : "cardinality",style:"card-col", header: "Cardinality", position:4},
    {field : "length",style:"length-col", header: "Length", position:5 },
    {field : "confLength",style:"conf-col", header: "Conf.Length", position:6},
    {field : "datatype",style:"dt-col", header: "Data Type", position:7 },
    {field : "valueSet",style:"vs-col", header: "Value Set", position:8 },
    {field : "singleCode",style:"single-code-col", header: "Single Code", position:9},
    {field : "constantValue",style:"const-value-col", header: "Constant Value", position:10},
    {field : "predicate",style:"pred-col", header: "Predicate", position:11},
    {field : "textDef", style:"text-col",header: "Text Definition", position:12 },
    {field : "comment",style:"comment-col", header: "Comments", position:13}

  ];

  public static  conformanceStatementsColumns =[

    {field : "identifier", style:"name-col", header: "Identifier", position:1 },
    {field : "description",style:"name-col", header: "Description", position:2 }

  ];
}
