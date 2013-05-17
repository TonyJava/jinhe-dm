
    /*
     *	���İ����·��
     */
    URL_CORE = "../../";

    /*
     *	��̨��Ӧ���ݽڵ�����
     */
    XML_MAIN_FORM = "SearchLog";
    /*
     *	Ĭ��Ψһ�����ǰ׺
     */
    CACHE_MAIN_FORM = "xform__id";
    /*
     *	XMLHTTP�����ַ����
     */
    URL_INIT = "data/searchlog_init.xml";

    URL_INIT = "config/LogSearchXForm.xml";

    /*
     *	����˵����ҳ���ʼ��
     *	������	
     *	����ֵ��
     */
    function init(){
        loadInitData();
    }
    /*
     *	����˵����ҳ���ʼ����������(��������������)
     *	������	
     *	����ֵ��
     */
    function loadInitData(){
        var p = new HttpRequestParams();
        p.url = URL_INIT;

        var request = new HttpRequest(p);
        request.onresult = function(){
            var searchLogFormNode = this.getNodeValue(XML_MAIN_FORM);
            var searchLogFormNodeID = CACHE_MAIN_FORM;

            var row = searchLogFormNode.selectSingleNode("./data/row");
            var args = window.dialogArguments;
            for(var item in args){
                if("title"!=item){
                    row.setCDATA(item,args[item]);
                }
            }

            Cache.XmlIslands.add(searchLogFormNodeID,searchLogFormNode);

            initTree(searchLogFormNodeID);
        }
        request.send();
    }
    /*
     *	����˵���������û�xform��ʼ��
     *	������	string:cacheID      ��������ID
     *	����ֵ��
     */
    function initTree(cacheID){
        var xformObj = $("searchForm");
        Public.initHTC(xformObj,"isLoaded","oncomponentready",function(){
            initXFormData(cacheID);
        });
    }
    /*
     *	����˵���������û�xform��ʼ��
     *	������	string:cacheID      ��������ID
     *	����ֵ��
     */
    function initXFormData(cacheID){
        var xmlIsland = Cache.XmlIslands.get(cacheID);
        if(null!=xmlIsland){
            var xformObj = $("searchForm");
            xformObj.load(xmlIsland.node,null,"node");
        }
    }
    /*
     *	����˵���������������
     *	������	
     *	����ֵ��
     */
    function getCondition(){
        var condition = {};

        //������Ϣ
        var searchInfoNode = Cache.XmlIslands.get(CACHE_MAIN_FORM);
        if(null!=searchInfoNode){
            var searchInfoDataNode = searchInfoNode.selectSingleNode(".//data");
            if(null!=searchInfoDataNode){
                condition.prefix = searchInfoNode.selectSingleNode("./declare").getAttribute("prefix");
                condition.dataXml = searchInfoDataNode.toXml();
            }
        }
        window.returnValue = condition;
        window.close();
    }

    window.onload = init;