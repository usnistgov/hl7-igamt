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
    {field : "text", style:"text-col",header: "Text Definition", position:11 },
    {field : "comment",style:"comment-col", header: "Comments", position:12}

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
    {field : "text", style:"text-col",header: "Text Definition", position:11 },
    {field : "comment",style:"comment-col", header: "Comments", position:12}


  ];

  public static  messageColumns =[

    {field : "name", header: "Name", position:1 },

    {field : "usage", header: "Usage", position:2 },
    {field : "cardinality", header: "Cardinality", position:3},


    {field : "length", header: "Length", position:4 },

    {field : "confLength", header: "Conf.Length", position:5},

    {field : "datatype", header: "Data Type", position:6 },

    {field : "valueSet", header: "Value Set", position:7 },

    {field : "singleCode", header: "Single Code", position:8},

    {field : "constantValue", header: "Constant Value", position:9},
    {field : "predicate", header: "Predicate", position:10},

    {field : "text", header: "Text Definition", position:11 },

    {field : "comment", header: "Comments", position:12}

  ];
}
