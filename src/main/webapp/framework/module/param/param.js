
    /*
     *	���İ����·��
     */
    URL_CORE = "../../";

    
    /*
     *	��̨��Ӧ���ݽڵ�����
     */
    XML_TOOLBAR = "ToolBar";
    XML_MAIN_TREE = "ParamTree";
    XML_PARAM_LIST = "ParamList";
    XML_PARAM_INFO = "ParamInfo";
    XML_OPERATION = "Operation";
    XML_PAGE_LIST = "PageList";
    XML_PROPERTY_INFO = "PropertyInfo";
    /*
     *	Ĭ��Ψһ�����ǰ׺
     */
    CACHE_GRID_ROW_DETAIL = "row__id";
    CACHE_TREE_NODE_DETAIL = "treeNode__id";
    CACHE_VIEW_TREE_NODE_DETAIL = "viewTreeNode__id";
    CACHE_MAIN_TREE = "tree__id";
    CACHE_TOOLBAR = "toolbar__id";
    CACHE_UPLOAD_DETAIL = "upload__id";
    CACHE_TREE_NODE_GRID = "treeNodeGrid__id";
    /*
     *	����
     */
    OPERATION_ADD = "����$label";
    OPERATION_VIEW = "�鿴\"$label\"";
    OPERATION_DEL = "ɾ��\"$label\"";
    OPERATION_EDIT = "�༭\"$label\"";
    OPERATION_IMPORT ="����\"$label\"";
    /*
     *	XMLHTTP�����ַ����
     */
    URL_INIT = "data/param_init.xml";
    URL_PARAM_DETAIL = "data/param1.xml";
    URL_TREENODE_DEL = "data/_success.xml";
    URL_TREENODE_DISABLE = "data/_success.xml";
    URL_SAVE_PARAM = "data/_success.xml";
    URL_SORT_PARAM = "data/_success.xml";
    URL_FLUSH_PARAM_CACHE  = "../../../pms/param!flushParamCache.action";
    URL_COPY_PARAM = "data/_success.xml";
    URL_COPY_PARAM_TO = "data/_success.xml";
    URL_MOVE_PARAM_TO = "data/_success.xml";
    URL_GET_OPERATION = "data/operation.xml";

    URL_INIT = URL_CORE + "../param!get2Tree.action";
    URL_PARAM_DETAIL = URL_CORE + "../param!getParamInfo.action";
    URL_TREENODE_DEL = URL_CORE + "../param!delParam.action";
    URL_TREENODE_DISABLE = "../../../param!startOrStopParam.action";
    URL_SAVE_PARAM = URL_CORE + "../param!saveParam.action";
    URL_SORT_PARAM = "../../../param!sortParam.action";
    URL_FLUSH_PARAM_CACHE  = "../../../pms/param!flushParamCache.action";
    URL_COPY_PARAM = "../../../param!copyParam.action";
    URL_COPY_PARAM_TO = "../../../param!copyParam.action";
    URL_MOVE_PARAM_TO = "../../../param!moveParam.action";
    URL_GET_OPERATION = "data/operation.xml";
    /*
     *	��ʱ
     */
    TIMEOUT_TAB_CHANGE = 200;
    /*
     *	icon·��
     */
    ICON = "images/";

    var toolbar = null;

    /*
     *	����˵����ҳ���ʼ��
     *	������	
     *	����ֵ��
     */
    function init(){
        initPaletteResize();
        //initUserInfo();
        initToolBar();
        initNaviBar("mod.4");
        initMenus();
        initBlocks();
        initWorkSpace(false);
        initEvents();
        initFocus();

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
            var _operation = this.getNodeValue(XML_OPERATION);

            var groupTreeNode = this.getNodeValue(XML_MAIN_TREE);
            var groupTreeNodeID = CACHE_MAIN_TREE;

            Cache.XmlIslands.add(groupTreeNodeID,groupTreeNode);

            loadToolBar(_operation);
            initTree(groupTreeNodeID);
        }
        request.send();
    }
    /*
     *	����˵������������������
     *	������	string:_operation      ����Ȩ��
     *	����ֵ��
     */
    function loadToolBar(_operation){
        var xmlIsland = Cache.XmlIslands.get(CACHE_TOOLBAR);
        if(null==xmlIsland){//��û�оʹ���

            var str = [];
            str[str.length] = "<toolbar>";

            //����
            str[str.length] = "    <button id=\"a1\" code=\"p1\" icon=\"" + ICON + "icon_pre.gif\" label=\"��ҳ\" cmd=\"ws.prevTab()\" enable=\"true\"/>";
            str[str.length] = "    <button id=\"a2\" code=\"p2\" icon=\"" + ICON + "icon_next.gif\" label=\"��ҳ\" cmd=\"ws.nextTab()\" enable=\"true\"/>";
            str[str.length] = "    <separator/>";

            //��������
            str[str.length] = "    <button id=\"b1\" code=\"2\" icon=\"" + ICON + "start.gif\" label=\"����\" cmd=\"enableParam()\" enable=\"'_rootId'!=getTreeNodeId() &amp;&amp; '0'!=getTreeNodeDisabled()\"/>";
            str[str.length] = "    <button id=\"b2\" code=\"2\" icon=\"" + ICON + "stop.gif\" label=\"ͣ��\" cmd=\"disableParam()\" enable=\"'_rootId'!=getTreeNodeId() &amp;&amp; '0'==getTreeNodeDisabled()\"/>";
            str[str.length] = "    <button id=\"b4\" code=\"1\" icon=\"" + ICON + "view.gif\" label=\"�鿴\" cmd=\"editParamInfo(false)\" enable=\"'_rootId'!=getTreeNodeId()\"/>";
            str[str.length] = "    <button id=\"b5\" code=\"2\" icon=\"" + ICON + "edit.gif\" label=\"�༭\" cmd=\"editParamInfo()\" enable=\"'_rootId'!=getTreeNodeId()\"/>";
            str[str.length] = "    <button id=\"b6\" code=\"2\" icon=\"" + ICON + "del.gif\" label=\"ɾ��\" cmd=\"delParam()\" enable=\"'_rootId'!=getTreeNodeId()\"/>";
            str[str.length] = "    <button id=\"b7\" code=\"2\" icon=\"" + ICON + "copy.gif\" label=\"����\" cmd=\"copyParam()\" enable=\"'_rootId'!=getTreeNodeId()\"/>";
            str[str.length] = "    <button id=\"b8\" code=\"2\" icon=\"" + ICON + "copy_to.gif\" label=\"���Ƶ�...\" cmd=\"copyParamTo()\" enable=\"'_rootId'!=getTreeNodeId()\"/>";
            str[str.length] = "    <button id=\"b9\" code=\"2\" icon=\"" + ICON + "move.gif\" label=\"�ƶ���...\" cmd=\"moveParamTo()\" enable=\"'_rootId'!=getTreeNodeId()\"/>";
            str[str.length] = "    <button id=\"b10\" code=\"2\" icon=\"" + ICON + "new_param_group.gif\" label=\"�½�������\" cmd=\"addNewParam('0')\" enable=\"'0'==getTreeNodeType() || '_rootId'==getTreeNodeId()\"/>";
//            str[str.length] = "    <button id=\"b11\" code=\"2\" icon=\"" + ICON + "new_param.gif\" label=\"�½�����\" cmd=\"addNewParam('0')\" enable=\"'0'==getTreeNodeType()\"/>";
//            str[str.length] = "    <button id=\"b12\" code=\"2\" icon=\"" + ICON + "new_param_item.gif\" label=\"�½�������\" cmd=\"addNewParam('0')\" enable=\"'0'==getTreeNodeType()\"/>";
            str[str.length] = "</toolbar>";

            var xmlReader = new XmlReader(str.join("\r\n"));
            var xmlNode = new XmlNode(xmlReader.documentElement);

            Cache.XmlIslands.add(CACHE_TOOLBAR,xmlNode);
            xmlIsland = xmlNode;

            //���빤����
            toolbar.loadXML(xmlIsland);
        }

        //������ʾ
        var buttons = xmlIsland.selectNodes("./button");
        for(var i=0,iLen=buttons.length;i<iLen;i++){
            var curButton = buttons[i];
            var id = curButton.getAttribute("id");
            var code = curButton.getAttribute("code");
            var enableStr = curButton.getAttribute("enable");

            var reg = new RegExp("(^"+code+",)|(^"+code+"$)|(,"+code+",)|(,"+code+"$)","gi");
            var visible = false;
            if("string"==typeof(_operation)){
                visible = (true==reg.test(_operation)?true:false);
            }
            toolbar.setVisible(id,visible);

            if(true==visible){
                var enable = Public.execCommand(enableStr);
                toolbar.enable(id,enable);
            }
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
        var item1 = {
            label:"�½�����",
            callback:null,
            enable:function(){return true;},
            visible:function(){return "0"==getTreeNodeType() && true==getOperation("2");}
        }
        var item2 = {
            label:"ɾ��",
            callback:delParam,
            icon:ICON + "del.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeNodeId() && true==getOperation("2");}
        }
        var item3 = {
            label:"�༭",
            callback:editParamInfo,
            icon:ICON + "edit.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeNodeId() && true==getOperation("2");}
        }
        var item4 = {
            label:"����",
            callback:enableParam,
            icon:ICON + "start.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeNodeId() && "0"!=getTreeNodeDisabled() && true==getOperation("2");}
        }
        var item5 = {
            label:"ͣ��",
            callback:disableParam,
            icon:ICON + "stop.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeNodeId() && "0"==getTreeNodeDisabled() && true==getOperation("2");}
        }
        var item7 = {
            label:"�½�������",
            callback:function(){
                addNewParam("0");
            },
            enable:function(){return true;},
            visible:function(){return ("0"==getTreeNodeType() || "_rootId"==getTreeNodeId()) && true==getOperation("2");}
        }
        var item9={
            label:"����",
            callback:copyParam,
            icon:ICON + "copy.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeNodeId() && true==getOperation("2");}
        }
        var item11={
            label:"���Ƶ�...",
            callback:copyParamTo,
            icon:ICON + "copy_to.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeNodeId() && true==getOperation("2");}
        }
        var item12={
            label:"�ƶ���...",
            callback:moveParamTo,
            icon:ICON + "move.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeNodeId() && true==getOperation("2");}
        }
        var item13 = {
            label:"�鿴",
            callback:function(){
                editParamInfo(false);
            },
            icon:ICON + "view.gif",
            enable:function(){return true;},
            visible:function(){return "_rootId"!=getTreeNodeId() && true==getOperation("1");}
        }
        var item14 = {
            label:"�½�������",
            callback:function(){
                addNewParam("2");
            },
            enable:function(){return true;},
            visible:function(){return (("1"==getTreeNodeMode() && "1"==getTreeNodeType()) || "2"==getTreeNodeMode()) && true==getOperation("2");}
        }
		var item15 = {
            label:"ˢ�²�������",
            callback:function(){
                flushParamCache();
            },
            enable:function(){return true;},
            visible:function(){return "1"==getTreeNodeType();}
        }


        //�½������Ӳ˵�
        var subitem1_1 = {
            label:"����",
            callback:function(){
                addNewParam("1","0");
            },
            enable:function(){return true;},
            visible:function(){return true;}
        }
        var subitem1_2 = {
            label:"������",
            callback:function(){
                addNewParam("1","1");
            },
            enable:function(){return true;},
            visible:function(){return true;}
        }
        var subitem1_3 = {
            label:"����",
            callback:function(){
                addNewParam("1","2");
            },
            enable:function(){return true;},
            visible:function(){return true;}
        }
        var submenu1 = new Menu();
        submenu1.addItem(subitem1_1);
        submenu1.addItem(subitem1_2);
        submenu1.addItem(subitem1_3);
        item1.submenu = submenu1;        

        var menu1 = new Menu();
        menu1.addItem(item4);
        menu1.addItem(item5);
        menu1.addSeparator();
        menu1.addItem(item13);
        menu1.addItem(item3);
        menu1.addItem(item2);
        menu1.addItem(item9);
        menu1.addItem(item11);
        menu1.addItem(item12);
        menu1.addSeparator();
        menu1.addItem(item7);
        menu1.addItem(item1);
        menu1.addItem(item14);

		menu1.addSeparator();
		menu1.addItem(item15);

        var treeObj = $("tree");
        treeObj.contextmenu = menu1;
    }
    /*
     *	����˵���������ʼ��
     *	������	
     *	����ֵ��
     */
    function initBlocks(){
        var paletteObj = $("palette");
        Blocks.create(paletteObj);

        var treeContainerObj = $("treeContainer");
        Blocks.create(treeContainerObj,treeContainerObj.parentNode);

        var statusContainerObj = $("statusContainer");
        Blocks.create(statusContainerObj,statusContainerObj.parentNode,false);

        //״̬��Ϣ��ʵ���̳�WritingBlock��д����
        var block = Blocks.getBlock("statusContainer");
        if(null!=block){
            block.inherit(WritingBlock);
        }     
    }
    /*
     *	����˵������ʾ����״̬��Ϣ
     *	������	number:rowIndex     grid�����к�
     *	����ֵ��
     */
    function showPropertyStatus(rowIndex){
        var gridObj = $("grid");
        var rowNode = gridObj.getRowNode_Xml(rowIndex);
        var rowName = gridObj.getNamedNodeValue_Xml(rowIndex,"name");
        var rowID = rowNode.getAttribute("id");
        var block = Blocks.getBlock("statusContainer");
        if(null!=block){
            block.open();
            block.writeln("����",rowName);
            block.writeln("ID",rowID);
            block.close();
        }
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
            treeObj.onTreeNodeMoved = function(eventObj){
                onTreeNodeMoved(eventObj);
            }
            treeObj.onTreeNodeRightClick = function(eventObj){
                onTreeNodeRightClick(eventObj);
            }
        }    
    }
    function sortParamTo(eventObj){
        var treeObj = $("tree");
        var movedTreeNode = eventObj.movedTreeNode;
        var toTreeNode = eventObj.toTreeNode;
        var moveState = eventObj.moveState;
        var moveGroupType = movedTreeNode.getAttribute("parentId");
        var moveParamType = movedTreeNode.getAttribute("groupId");
        var toGroupType = toTreeNode.getAttribute("parentId");
        var toParamType = toTreeNode.getAttribute("groupId");

        var p = new HttpRequestParams();
        p.url = URL_SORT_PARAM;
        p.setContent("targetId",toTreeNode.getId());
        p.setContent("paramId",movedTreeNode.getId());
        p.setContent("direction",moveState);//-1Ŀ���Ϸ�,1Ŀ���·�

        var request = new HttpRequest(p);
        request.onsuccess = function(){
            //�ƶ����ڵ�
            treeObj.moveTreeNode(movedTreeNode, toTreeNode, moveState);
        }
        request.send();
    }
    /*
     *	����˵�����۽���ʼ��
     *	������	
     *	����ֵ��
     */
    function initFocus(){
        var treeTitleObj = $("treeTitle");
        var statusTitleObj = $("statusTitle");

        Focus.register(treeTitleObj.firstChild);
        Focus.register(statusTitleObj.firstChild);
    }
    /*
     *	����˵�����¼��󶨳�ʼ��
     *	������	
     *	����ֵ��
     */
    function initEvents(){
        var treeBtRefreshObj = $("treeBtRefresh");
        var treeTitleBtObj = $("treeTitleBt");
        var statusTitleBtObj = $("statusTitleBt");
        var paletteBtObj = $("paletteBt");

        var treeTitleObj = $("treeTitle");
        var statusTitleObj = $("statusTitle");
        
        Event.attachEvent(treeBtRefreshObj,"click",onClickTreeBtRefresh);
        Event.attachEvent(treeTitleBtObj,"click",onClickTreeTitleBt);
        Event.attachEvent(statusTitleBtObj,"click",onClickStatusTitleBt);
        Event.attachEvent(paletteBtObj,"click",onClickPaletteBt);

        Event.attachEvent(treeTitleObj,"click",onClickTreeTitle);
        Event.attachEvent(statusTitleObj,"click",onClickStatusTitle);
    }
    /*
     *	����˵����������ڵ�
     *	������	Object:eventObj     ģ���¼�����
     *	����ֵ��
     */
    function onTreeNodeActived(eventObj){
        var treeTitleObj = $("treeTitle");
        Focus.focus(treeTitleObj.firstChild.id);

        showTreeNodeStatus({id:"ID",name:"����",user:"������",date:"����ʱ��",lastModifyUserName:"�޸���",lastdate:"�޸�ʱ��"});

        //��ֹ��Ϊ���빤�������ݶ����²���Ӧ˫���¼�
        clearTimeout(window._toolbarTimeout);
        window._toolbarTimeout = setTimeout(function(){
            loadToolBarData(eventObj.treeNode);
        },0);
    }
    /*
     *	����˵����˫�����ڵ�
     *	������	Object:eventObj     ģ���¼�����
     *	����ֵ��
     */
    function onTreeNodeDoubleClick(eventObj){
        var treeNode = eventObj.treeNode;
        var id = getTreeNodeId();
        getTreeOperation(treeNode,function(_operation){
            var canEdit = checkOperation("2",_operation);
            if("_rootId"!=id){
                editParamInfo(canEdit);
            }
        });
    }
    /*
     *	����˵������Դ���ڵ��ƶ�
     *	������
     *	����ֵ��
     */
    function onTreeNodeMoved(eventObj){
        sortParamTo(eventObj);
    }
    /*
     *	����˵������Դ�������Ҽ�
     *	������
     *	����ֵ��
     */
    function onTreeNodeRightClick(eventObj){
        var treeObj = $("tree");
        var treeNode = eventObj.treeNode;

        showTreeNodeStatus({id:"ID",name:"����",user:"������",date:"����ʱ��",lastModifyUserName:"�޸���",lastdate:"�޸�ʱ��"});

        var x = eventObj.clientX;
        var y = eventObj.clientY;
        getTreeOperation(treeNode,function(_operation){
            if(null!=treeObj.contextmenu){
                treeObj.contextmenu.show(x,y);                
            }
            loadToolBar(_operation);
        });
    }
    /*
     *	����˵������������������
     *	������	treeNode:treeNode       treeNodeʵ��
     *	����ֵ��
     */
    function loadToolBarData(treeNode){
        if(null!=treeNode){
            getTreeOperation(treeNode,function(_operation){
                loadToolBar(_operation);
            });
        }
    }
    /*
     *	����˵�����༭������Ϣ
     *	������  boolean:editable            �Ƿ�ɱ༭(Ĭ��true)
     *	����ֵ��
     */
    function editParamInfo(editable){
        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var treeID = treeNode.getId();
            var treeName = treeNode.getName();
            var type = treeNode.getAttribute("type");
			var mode = treeNode.getAttribute("mode");

            var callback = {};
            callback.onTabClose = function(eventObj){
                delCacheData(eventObj.tab.SID);
            };
            callback.onTabChange = function(){
                setTimeout(function(){
                    loadTreeDetailData(treeID,editable,treeID,type,false,mode);
                },TIMEOUT_TAB_CHANGE);
            };

            var inf = {};
            if(false==editable){
                inf.label = OPERATION_VIEW.replace(/\$label/i,treeName);
                inf.SID = CACHE_VIEW_TREE_NODE_DETAIL + treeID;
            }else{
                inf.label = OPERATION_EDIT.replace(/\$label/i,treeName);
                inf.SID = CACHE_TREE_NODE_DETAIL + treeID;
            }
            inf.defaultPage = "page1";
            inf.phases = null;
            inf.callback = callback;
            var tab = ws.open(inf);
        }
    }
    /*
     *	����˵�������ڵ�������ϸ��Ϣ��������
     *	������	string:treeID               ���ڵ�id
                boolean:editable            �Ƿ�ɱ༭(Ĭ��true)
                string:parentID             ���ڵ�id
                boolean:isNew               �Ƿ�����
                boolean:type                �ڵ�����(0������/1����/2������)
     *	����ֵ��
     */
    function loadTreeDetailData(treeID,editable,parentID,type,isNew,mode){
        if(false==editable){
            var cacheID = CACHE_VIEW_TREE_NODE_DETAIL + treeID;
        }else{
            var cacheID = CACHE_TREE_NODE_DETAIL + treeID;
        }
        var treeDetail = Cache.Variables.get(cacheID);
        if(null==treeDetail){
            var p = new HttpRequestParams();
            p.url = URL_PARAM_DETAIL;

            p.setContent("paramId", treeID);
            p.setContent("type", type);
            //���������
            if(true==isNew){
                p.setContent("isNew", 1);
				p.setContent("parentId", parentID);
            }
			if("1"==type){
				p.setContent("mode", mode);
			}

            var request = new HttpRequest(p);
            request.onresult = function(){
                var paramInfoNode = this.getNodeValue(XML_PARAM_INFO);
                var paramInfoNodeID = cacheID+"."+XML_PARAM_INFO;

                Cache.XmlIslands.add(paramInfoNodeID,paramInfoNode);
                Cache.Variables.add(cacheID,[paramInfoNodeID]);

                initParamPages(cacheID,editable,parentID,isNew,type);
            }
            request.send();
        }else{
            initParamPages(cacheID,editable,parentID,isNew,type);
        }
    }
    /*
     *	����˵�����������ҳ��������
     *	������	string:cacheID              ��������id
                boolean:editable            �Ƿ�ɱ༭(Ĭ��true)
                string:parentID             ���ڵ�id
                boolean:isNew               �Ƿ�����
                boolean:type                �ڵ�����(0������/1����/2������)
     *	����ֵ��
     */
    function initParamPages(cacheID,editable,parentID,isNew,type){
        var page1FormObj = $("page1Form");
        Public.initHTC(page1FormObj,"isLoaded","oncomponentready",function(){
            loadParamInfoFormData(cacheID,editable);
        });

        //���ñ��水ť����
        var page1BtSaveObj = $("page1BtSave");
        page1BtSaveObj.onclick = function(){
            saveParam(cacheID,parentID,isNew,type);
        }
    }
    /*
     *	����˵����������Ϣxform��������
     *	������	string:cacheID              ��������id
                boolean:editable            �Ƿ�ɱ༭(Ĭ��true)
     *	����ֵ��
     */
    function loadParamInfoFormData(cacheID,editable){
        var xmlIsland = Cache.XmlIslands.get(cacheID+"."+XML_PARAM_INFO);
        if(null!=xmlIsland){
            var page1FormObj = $("page1Form");
            page1FormObj.editable = editable==false?"false":"true";
            page1FormObj.load(xmlIsland.node,null,"node");

            //2007-3-1 �뿪����
            attachReminder(cacheID,page1FormObj);
        }
    }
    /*
     *	����˵�����������
     *	������	string:cacheID          ��������id
                string:parentID         ���ڵ�id
                boolean:isNew           �Ƿ�����
                boolean:type            �ڵ�����(0������/1����/2������)
     *	����ֵ��
     */
    function saveParam(cacheID,parentID,isNew,type){
        var page1FormObj = $("page1Form");	
        if(false==page1FormObj.checkForm()){
            return;
        }

        var p = new HttpRequestParams();
        p.url = URL_SAVE_PARAM;
        p.setContent("type",type);

        //�Ƿ��ύ
        var flag = false;
        
        var groupCache = Cache.Variables.get(cacheID);
        if(null!=groupCache){       

            //����������Ϣ
            var paramInfoNode = Cache.XmlIslands.get(cacheID+"."+XML_PARAM_INFO);
            if(null!=paramInfoNode){
                var paramInfoDataNode = paramInfoNode.selectSingleNode(".//data");
                if(null!=paramInfoDataNode){
                    flag = true;

                    var prefix = paramInfoNode.selectSingleNode("./declare").getAttribute("prefix");
                    p.setXFormContent(paramInfoDataNode,prefix);
                }
            }
        }

        if(true==flag){
            var request = new HttpRequest(p);
            //ͬ����ť״̬
            var page1BtSaveObj = $("page1BtSave");
            syncButton([page1BtSaveObj],request);

            request.onresult = function(){
                if(true==isNew){
                    //�������
                    detachReminder(cacheID);

                    var treeNode = this.getNodeValue(XML_MAIN_TREE).selectSingleNode("treeNode");
                    appendTreeNode(parentID,treeNode);

                    var ws = $("ws");
                    ws.closeActiveTab();
                }
            }
            request.onsuccess = function(){
                if(true!=isNew){
                    //�������
                    detachReminder(cacheID);
				
                    //�������ڵ�����
					var id = cacheID.trim(CACHE_TREE_NODE_DETAIL);
					if("1" == type){
						var name = page1FormObj.getData("name");
						if("" == name || null==name){
							name = page1FormObj.getData("code");
						}
						modifyTreeNode(id,"name",name,true);
					} else if("2"==type){
                        var text = page1FormObj.getData("text");
						if("" == text || null==text){
							text = page1FormObj.getData("value");
						}
						modifyTreeNode(id,"name",text,true);
                    }
                }
            }
            request.send();
        }
    }
    /*
     *	����˵����ɾ�������ڵ�
     *	������
     *	����ֵ��
     */
    function delParam(){
        if(true!=confirm("��ȷ��Ҫɾ����")){
            return;
        }
        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        if (null!=treeNode){
            var id = treeNode.getId();
            var type = treeNode.getAttribute("type");

            var p = new HttpRequestParams();
            p.url = URL_TREENODE_DEL;

            p.setContent("paramId",id);
            p.setContent("type",type);

            var request = new HttpRequest(p);
            request.onsuccess = function(){
                var parentNode = treeNode.getParent();
                if(null!=parentNode){
                    treeObj.setActiveTreeNode(parentNode.getId());
                }
                //������ɾ��
                treeObj.removeTreeNode(treeNode);
            }
            request.send();
        }
    }
    /*
     *	����˵��������
     *	������
     *	����ֵ��
     */
    function enableParam(){
        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var id = treeNode.getId();
            var type = treeNode.getAttribute("type");

            var p = new HttpRequestParams();
            p.url = URL_TREENODE_DISABLE;

            p.setContent("paramId",id);
            p.setContent("type",type);
            p.setContent("disabled","0");

            var request = new HttpRequest(p);
            request.onsuccess = function(){
                var xmlNode = new XmlNode(treeNode.node);
                refreshTreeNodeStates(xmlNode,"0");

                //ˢ�¹�����
                loadToolBarData(treeNode);
            }
            request.send();	
        }

    }
	    /*
     *	����˵��������
     *	������
     *	����ֵ��
     */
    function flushParamCache(){
        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var id = treeNode.getId();

            var p = new HttpRequestParams();
            p.url = URL_FLUSH_PARAM_CACHE;

            p.setContent("paramId",id);

            var request = new HttpRequest(p);
            request.onsuccess = function(){
            }
            request.send();	
        }

    }
    /*
     *	����˵����ͣ��
     *	������
     *	����ֵ��
     */
    function disableParam(){
        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var id = treeNode.getId();
            var type = treeNode.getAttribute("type");

            var p = new HttpRequestParams();
            p.url = URL_TREENODE_DISABLE;

            p.setContent("paramId",id);
            p.setContent("type",type);
            p.setContent("disabled","1");

            var request = new HttpRequest(p);
            request.onsuccess = function(){
                var xmlNode = new XmlNode(treeNode.node);
                refreshTreeNodeStates(xmlNode,"1");

                //ˢ�¹�����
                loadToolBarData(treeNode);
            }
            request.send();	
        }
    }
    /*
     *	����˵�����½�����
     *	������  string:type         �ڵ�����(0������/1����/2������)
                string:mode         ����������(0����/1������/2����)
     *	����ֵ��
     */
    function addNewParam(type,mode){
        switch(type){
            case "0":
                var treeName = "������";
                break;
            case "1":
                var treeName = "����";
                break;
            case "2":
                var treeName = "������";
                break;
        }
        var treeID = new Date().valueOf();

        var treeObj = $("tree");
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var parentID = treeNode.getId();

            var callback = {};
            callback.onTabClose = function(eventObj){
                delCacheData(eventObj.tab.SID);
            };
            callback.onTabChange = function(){
                setTimeout(function(){
                    loadTreeDetailData(treeID,true,parentID,type,true,mode);
                },TIMEOUT_TAB_CHANGE);
            };

            var inf = {};
            inf.defaultPage = "page1";
            inf.label = OPERATION_ADD.replace(/\$label/i,treeName);
            inf.phases = null;
            inf.callback = callback;
            inf.SID = CACHE_TREE_NODE_DETAIL + treeID;
            var tab = ws.open(inf);
        }
    }
    /*
     *	����˵��������������iframe
     *	������  
     *	����ֵ��
     */
    function createExportFrame(){
        var frameName = "exportFrame";
        var frameObj = $(frameName);
        if(null==frameObj){
            frameObj = document.createElement("<iframe name='"+frameName+"' id='"+frameName+"' src='about:blank' style='display:none'></iframe>");
            document.body.appendChild(frameObj);
        }
        return frameName;
    }
    /*
     *	����˵������ȡ�ڵ�id
     *	������  
     *	����ֵ��string:id   ���ڵ�id
     */
    function getTreeNodeId(){
        return getTreeAttribute("id");
    }
    /*
     *	����˵������ȡ�ڵ�disabled
     *	������  
     *	����ֵ��string:disabled   ���ڵ�disabled
     */
    function getTreeNodeDisabled(){
        return getTreeAttribute("disabled");
    }
    /*
     *	����˵������ȡ�ڵ�type
     *	������  
     *	����ֵ��string:type   ���ڵ�type
     */
    function getTreeNodeType(){
        return getTreeAttribute("type");
    }
    /*
     *	����˵������ȡ�ڵ�mode
     *	������  
     *	����ֵ��string:mode   ���ڵ�mode
     */
    function getTreeNodeMode(){
        return getTreeAttribute("mode");
    }
    /*
     *	����˵����ˢ�����ڵ�ͣ������״̬
     *	������	treeNode:treeNode       treeNodeʵ��
                string:state            ͣ/����״̬
     *	����ֵ��
     */
    function refreshTreeNodeState(treeNode,state){
        if(null==state){
            state = treeNode.getAttribute("disabled");
        }
        var type = treeNode.getAttribute("type");
        var mode = treeNode.getAttribute("mode");
        switch(type){
            case "0":
                var img = "param_group";
                break;
            case "1":
                if("0"==mode){
                    var img = "param_simple";
                }else if("1"==mode){
                    var img = "param_combo";
                }else{
                    var img = "param_tree";
                }
                break;
            case "2":
                var img = "param_item";
                break;
        }
        treeNode.setAttribute("disabled",state);
        treeNode.setAttribute("icon",ICON + img + (state=="1"?"_2":"") + ".gif");       
    }
    /*
     *	����˵����ˢ�¼������ڵ�ͣ������״̬
     *	������	XmlNode:curNode         XmlNodeʵ��
                string:state            ͣ/����״̬
     *	����ֵ��
     */
    function refreshTreeNodeStates(curNode,state){
        refreshTreeNodeState(curNode,state);

        if("0" == state){//���ã�����
            while(null != curNode && "_rootId" != curNode.getAttribute("id")){
                refreshTreeNodeState(curNode,state);

                curNode = curNode.getParent();
            }        
        }else if("1" == state){//ͣ�ã�����
            var childNodes = curNode.selectNodes(".//treeNode");
            for(var i=0,iLen=childNodes.length;i<iLen;i++){                
                refreshTreeNodeState(childNodes[i],state);
            }
        }

        var treeObj = $("tree");
        treeObj.reload(); 
    }
    /*
     *	����˵�������Ʋ���
     *	������	
     *	����ֵ��
     */
    function copyParam(){
        var treeObj = $("tree"); 
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var id = treeNode.getId();
            var type = treeNode.getAttribute("type");
            var parentID = treeNode.getParent().getId();

            var p = new HttpRequestParams();
            p.url = URL_COPY_PARAM;

            p.setContent("paramId",id);
            p.setContent("type",type);

            var request = new HttpRequest(p);
            request.onresult = function(){
                var treeNode = this.getNodeValue(XML_MAIN_TREE).selectSingleNode("treeNode");
                appendTreeNode(parentID,treeNode);
            }
            request.send();
        }
    }
    /*
     *	����˵�������Ʋ�����
     *	������	
     *	����ֵ��
     */
    function copyParamTo(){
        var treeObj = $("tree"); 
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var id = treeNode.getId();
            var name = treeNode.getName();
            var type = treeNode.getAttribute("type");
            var parentID = treeNode.getParent().getId();
			var parentMode = treeNode.getParent().getAttribute("mode");

//            var action = "data/paramtree_init.xml";
            var action = "../param!getCanAddParamsTree.action";
            var params = {
                id:id,
			    type:type,
				parentID:parentID,
				mode:parentMode,
                action:"copyTo"
            };

            var group = window.showModalDialog("paramtree.htm",{params:params,title:"��\""+name+"\"���Ƶ�",action:action},"dialogWidth:300px;dialogHeight:400px;");
            if(null!=group){

                var p = new HttpRequestParams();
                p.url = URL_COPY_PARAM_TO;
                p.setContent("paramId",id);
                p.setContent("toParamId",group.id);

                var request = new HttpRequest(p);
                request.onresult = function(){
                    var newNode = this.getNodeValue(XML_MAIN_TREE).selectSingleNode("treeNode");
                    appendTreeNode(group.id,newNode);
                }
                request.send();
            }
        }
    }
    /*
     *	����˵�����ƶ�������
     *	������	
     *	����ֵ��
     */
    function moveParamTo(){
        var treeObj = $("tree"); 
        var treeNode = treeObj.getActiveTreeNode();
        if(null!=treeNode){
            var id = treeNode.getId();
            var name = treeNode.getName();
            var type = treeNode.getAttribute("type");
            var parentID = treeNode.getParent().getId();
			var parentMode = treeNode.getParent().getAttribute("mode");

//            var action = "paramtree_init.xml";
            var action = "../param!getCanAddParamsTree.action";
            var params = {
                id:id,
			    type:type,
				parentID:parentID,
				mode:parentMode,
                action:"moveTo"
            };

            var group = window.showModalDialog("paramtree.htm",{params:params,title:"��\""+name+"\"�ƶ���",action:action},"dialogWidth:300px;dialogHeight:400px;");
            if(null!=group){

                var p = new HttpRequestParams();
                p.url = URL_MOVE_PARAM_TO;
                p.setContent("paramId",id);
                p.setContent("toParamId",group.id);

                var request = new HttpRequest(p);
                request.onsuccess = function(){
                    //�ƶ����ڵ�
                    var parentNode = treeObj.getTreeNodeById(group.id);
                    var parentDisabled = parentNode.getAttribute("disabled");
                    parentNode.node.appendChild(treeNode.node);

                    var xmlNode = new XmlNode(treeNode.node);
                    refreshTreeNodeStates(xmlNode,parentDisabled);
                    clearOperation(xmlNode);

                    treeObj.reload();
                }
                request.send();
            }
        }
    }
    /*
     *	����˵������ȡ������Ȩ��
     *	������	treeNode:treeNode       treeNodeʵ��
                function:callback       �ص�����
     *	����ֵ��
     */
    function getTreeOperation(treeNode,callback){
        var id = treeNode.getId();
        var _operation = treeNode.getAttribute("_operation");

        if(null==_operation || ""==_operation){//����ڵ��ϻ�û��_operation���ԣ�������Ӻ�̨��ȡ��Ϣ
            var p = new HttpRequestParams();
            p.url = URL_GET_OPERATION;
            p.setContent("resourceId",id);

            var request = new HttpRequest(p);
            request.onresult = function(){
                _operation = this.getNodeValue(XML_OPERATION);
                treeNode.setAttribute("_operation",_operation);

                if(null!=callback){
                    callback(_operation);
                }
            }
            request.send();            
        }else{
            if(null!=callback){
                callback(_operation);
            }
        }    
    }



    window.onload = init;

	//�ر�ҳ���Զ�ע��
    window.attachEvent("onunload", function(){
        if(10000<window.screenTop || 10000<window.screenLeft){
            logout();
        }
	});