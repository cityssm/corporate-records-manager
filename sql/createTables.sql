create schema CR
GO


create table CR.Users (
	userName varchar(30) primary key not null,
	isActive bit not null default 0,
	canUpdate bit not null default 0,
	isAdmin bit not null default 0
)


create table CR.RecordTypes (
	recordTypeKey varchar(20) primary key not null,
	recordType varchar(100) not null,
	isActive bit not null default 1
)


insert into CR.RecordTypes (recordTypeKey, recordType) values ('agreement','Agreement')
insert into CR.RecordTypes (recordTypeKey, recordType) values ('bylaw',    'By-Law')
insert into CR.RecordTypes (recordTypeKey, recordType) values ('deed',     'Deed')
insert into CR.RecordTypes (recordTypeKey, recordType) values ('easement', 'Easement')


create table CR.Records (
	recordID bigint primary key identity not null,
	recordTypeKey varchar(20) not null,
	recordNumber varchar(30) not null,
	recordTitle nvarchar(100),
	recordDescription nvarchar(500),

	recordCreate_userName varchar(30) not null,
	recordCreate_datetime datetime not null default getdate(),
	recordUpdate_userName varchar(30) not null,
	recordUpdate_datetime datetime not null default getdate(),
	recordDelete_userName varchar(30),
	recordDelete_datetime datetime,

	constraint fk_records_recordtypekey foreign key (recordTypeKey) references CR.RecordTypes (recordTypeKey)
	on update cascade
	on delete no action
)


create table CR.RelatedRecords (
	recordID_A bigint not null,
	recordID_B bigint not null,

	constraint pk_relatedrecords primary key (recordID_A, recordID_B),
	constraint fk_relatedrecords_recordida foreign key (recordID_A) references CR.Records (recordID)
	on update no action
	on delete no action,
	constraint fk_relatedrecords_recordidb foreign key (recordID_B) references CR.Records (recordID)
	on update no action
	on delete no action,
	constraint ck_relatedrecords check (recordID_A < recordID_B)
)


create table CR.RecordTags (
	recordID bigint not null,
	tag varchar(100) not null,

	constraint pk_recordtags primary key (recordID, tag),
	constraint fk_recordtags_recordid foreign key (recordID) references CR.Records (recordID)
	on update no action
	on delete no action
)


create table CR.StatusTypes (
	statusTypeKey varchar(30) primary key not null,
	recordTypeKey varchar(20),
	statusType varchar(100),
	isActive bit not null default 1,

	constraint fk_statustypes_recordtypekey foreign key (recordTypeKey) references CR.RecordTypes (recordTypeKey)
	on update cascade
	on delete cascade
)


create table CR.RecordStatusLog (
	statusLogID bigint primary key not null identity,
	recordID bigint not null,

	statusTime datetime not null default getdate(),
	statusTypeKey varchar(30) not null,
	statusLog nvarchar(max),

	recordCreate_userName varchar(30) not null,
	recordCreate_datetime datetime not null default getdate(),
	recordUpdate_userName varchar(30) not null,
	recordUpdate_datetime datetime not null default getdate(),
	recordDelete_userName varchar(30),
	recordDelete_datetime datetime,

	constraint fk_recordstatuslog_recordid foreign key (recordID) references CR.Records (recordID)
	on update no action
	on delete no action,

	constraint fk_recordstatuslog_statustypekey foreign key (statusTypeKey) references CR.StatusTypes (statusTypeKey)
	on update cascade
	on delete no action
)


create table CR.RecordCommentLog (
	commentLogID bigint primary key not null identity,
	recordID bigint not null,

	commentTime datetime not null default getdate(),
	comment nvarchar(max) not null,

	recordCreate_userName varchar(30) not null,
	recordCreate_datetime datetime not null default getdate(),
	recordUpdate_userName varchar(30) not null,
	recordUpdate_datetime datetime not null default getdate(),
	recordDelete_userName varchar(30),
	recordDelete_datetime datetime,

	constraint fk_recordcommentlog_recordid foreign key (recordID) references CR.Records (recordID)
	on update no action
	on delete no action
)


create table CR.RecordURLs (
	urlID bigint primary key not null identity,
	recordID bigint not null,

	url varchar(500) not null,
	urlTitle nvarchar(200),
	urlDescription nvarchar(max),

	recordCreate_userName varchar(30) not null,
	recordCreate_datetime datetime not null default getdate(),
	recordUpdate_userName varchar(30) not null,
	recordUpdate_datetime datetime not null default getdate(),
	recordDelete_userName varchar(30),
	recordDelete_datetime datetime,

	constraint fk_recordurls_recordid foreign key (recordID) references CR.Records (recordID)
	on update no action
	on delete no action
)
