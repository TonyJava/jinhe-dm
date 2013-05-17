
    /*
     *	���İ����·��
     */
    URL_CORE = "../../";

    

    /*
     *	��̨��Ӧ���ݽڵ�����
     */
    XML_MAIN_TREE = "ParamTree";
    /*
     *	Ĭ��Ψһ�����ǰ׺
     */
    CACHE_MAIN_TREE = "tree__id";
    /*
     *	XMLHTTP�����ַ����
     */
	URL_ALL = "data/paramtree_init.xml";

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
        var xmlIsland = window.dialogArguments.xmlIsland;
        if(null!=xmlIsland){//����Ѿ����������ݵ����򲻱�ȥ��̨ȡ
            var paramTreeNode = xmlIsland;
            var paramTreeNodeID = CACHE_MAIN_TREE;

            Cache.XmlIslands.add(paramTreeNodeID,paramTreeNode);

            initTree(paramTreeNodeID);
        }else{
            var params = window.dialogArguments.params;
            var action = window.dialogArguments.action;

            var p = new HttpRequestParams();
            p.url = action;
            for(var item in params){
                p.setContent(item,params[item]);            
            }

            var request = new HttpRequest(p);
            request.onresult = function(){
                var paramTreeNode = this.getNodeValue(XML_MAIN_TREE);
                var paramTreeNodeID = CACHE_MAIN_TREE;
				
				var curNode = paramTreeNode.selectSingleNode(".//treeNode[@id='"+params.id+"']");
				if(null!=curNode){
					curNode.setAttribute("canselected","0");
					var sameIdTreeNodeChilds = curNode.selectNodes(".//treeNode");
					for(var i=0,iLen=sameIdTreeNodeChilds.length;i<iLen;i++){
						sameIdTreeNodeChilds[i].setAttribute("canselected","0");
					}
				}
				var curParentNode = paramTreeNode.selectSingleNode(".//treeNode[@id='"+params.parentID+"']");
				if(null!=curParentNode)
					curParentNode.setAttribute("canselected","0");

                Cache.XmlIslands.add(paramTreeNodeID,paramTreeNode);

                initTree(paramTreeNodeID);
            }
            request.send();
        }
    }
    /*
     *	����˵�����˵���ʼ��
     *	������	
     *	����ֵ��
     */
    function initMenus(){
        initTreeMenu();
    }
    /*
     *	����˵�������˵���ʼ��
     *	������	
     *	����ֵ��
     */
    function initTreeMenu(){	
    }
    /*
     *	����˵������Դ����ʼ��
     *	������	string:cacheID      ��������ID
     *	����ֵ��
     */
    function initTree(cacheID){
        var treeObj = $("tree");
        Public.initHTC(treeObj,"isLoaded","oncomponentready",function(){
            initTreeData(cacheID);
        });
    }
    /*
     *	����˵������Դ����������
     *	������
     *	����ֵ��
     */
    function initTreeData(cacheID){
        var xmlIsland = Cache.XmlIslands.get(cacheID);
        if(null!=xmlIsland){
            var treeObj = $("tree");
            treeObj.load(xmlIsland.node);

            treeObj.onTreeNodeActived = function(eventObj){
				onTreeNodeActived(eventObj);
            }
            treeObj.onTreeNodeDoubleClick = function(eventObj){
                onTreeNodeDoubleClick(eventObj);
            }
        }    
    }
    /*
     *	����˵����������ڵ�
     *	������	Object:eventObj     ģ���¼�����
     *	����ֵ��
     */
    function onTreeNodeActived(eventObj){
    }
    /*
     *	����˵����˫�����ڵ�
     *	������	Object:eventObj     ģ���¼�����
     *	����ֵ��
     */
    function onTreeNodeDoubleClick(eventObj){
        getGroup();
    }
    /*
     *	����˵���������ڵ�
     *	������	Object:eventObj     ģ���¼�����
     *	����ֵ��
     */
    function getGroup(){        
        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var returnValue = {};
            var attributes = treeNode.node.attributes;
            for(var i=0,iLen=attributes.length;i<iLen;i++){
                var name = attributes[i].nodeName;
                var value = attributes[i].nodeValue;
                returnValue[name] = value;
            }
            window.returnValue = returnValue;
            window.close();
        }
    }

    window.onload = init;